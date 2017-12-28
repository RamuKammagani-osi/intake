# frozen_string_literal: true

# PeopleSearchQueryBuilder is a service class responsible for creation
# of an elastic search person search query
class PersonSearchQueryBuilder
  attr_reader :search_term

  def self.format_search_term(term)
    term
      .downcase
      .gsub(/(\d+\s*)[^a-z0-9 ]+/, '\1') # Remove special chars after digits
      .gsub(/([a-z]+\s*)[^a-z0-9 ]+/, '\1 ') # Replace special chars after letters w/ space
  end

  def initialize(search_term = '')
    @search_term = self.class.format_search_term(search_term)
  end

  def build
    {
      query: {
        bool: {
          must: must
        }
      },
      _source: fields,
      highlight: highlight
    }
  end

  private

  def must
    return [base_query] unless Rails.configuration.intake[:client_only_search]
    [base_query, client_only]
  end

  def base_query
    {
      multi_match: {
        query: search_term,
        type: 'cross_fields',
        operator: 'and',
        fields: %w[searchable_name searchable_date_of_birth ssn]
      }
    }
  end

  def client_only
    {
      match: {
        'legacy_descriptor.legacy_table_name': 'CLIENT_T'
      }
    }
  end

  def fields
    %w[id legacy_source_table first_name middle_name last_name name_suffix gender
       date_of_birth ssn languages races ethnicity
       addresses.id addresses.street_name addresses.street_number
       addresses.city addresses.state_code addresses.zip addresses.type
       phone_numbers.id phone_numbers.number phone_numbers.type
       highlight legacy_descriptor sensitivity_indicator race_ethnicity]
  end

  def highlight
    {
      order: 'score',
      number_of_fragments: 3,
      require_field_match: false,
      fields: {
        '*': {}
      }
    }
  end
end
