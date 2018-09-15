# frozen_string_literal: true

# parent class for dora search
class QueryBuilder
  NUMBER_OF_FRAGMENTS = '10'
  LOW_BOOST = '2'
  MEDIUM_BOOST = '3'
  HIGH_BOOST = '7'
  NO_BOOST = '1'
  SIZE = '10'
  TRACK_SCORES = 'true'
  REQUIRE_FIELD_MATCH = 'false'

  attr_accessor :search_term, :search_address, :search_after, :is_client_only

  def initialize(**params)
    @search_term    = params[:search_term]
    @search_after   = params[:search_after]
    @search_address = params[:search_address]
    @is_client_only = params.fetch(:is_client_only, 'true') == 'true'
  end

  # def query
  #
  # end

  def build
    {
      size: SIZE, track_scores: TRACK_SCORES, sort: [{ _score: 'desc', _uid: 'desc' }],
      query: query, _source: fields, highlight: highlight
    }.tap do |query|
      query[:search_after] = @search_after if @search_after
    end
  end

  def formatted_query
    @search_term
      .downcase
      .gsub(%r{[-/]*(\d+)[-/]*}, '\1')
  end

  def must
    # the client_only_search config option overrides the @is_client_only value
    return [base_query] unless Rails.configuration.intake[:client_only_search] ||
        @is_client_only
    [base_query, client_only]
  end

  def query
    { bool: { must: must, should: should } }
  end

  def and_query(field, boost)
    { match: { field.to_sym => { query: formatted_query, operator: 'and', boost: boost } } }
  end

  def base_query
    { bool: { should: [
      fuzzy_query,
      and_query(:'autocomplete_search_bar.diminutive', NO_BOOST),
      and_query(:'autocomplete_search_bar.phonetic', NO_BOOST)
    ] } }
  end

  def match_query(field, boost)
    { match: { field.to_sym => { query: formatted_query, boost: boost } } }
  end

  def should
    [
      and_query(:autocomplete_search_bar, MEDIUM_BOOST),
      build_match_query
    ].flatten
  end

  def build_match_query
    self.class::ATTRIBUTES.map do |key, value|
      match_query(key, value)
    end
  end

  def fields
    %w[id legacy_source_table first_name middle_name last_name name_suffix gender
       date_of_birth date_of_death ssn languages races ethnicity client_counties
       addresses.id addresses.effective_start_date addresses.street_name addresses.street_number
       addresses.city addresses.state_code addresses.zip addresses.type addresses.legacy_descriptor
       addresses.phone_numbers.number addresses.phone_numbers.type legacy_descriptor highlight
       phone_numbers.id phone_numbers.number phone_numbers.type sensitivity_indicator race_ethnicity
       open_case_responsible_agency_code]
  end

  def fuzzy_query
    {
      match: {
        autocomplete_search_bar: { query: formatted_query, operator: 'and', boost: LOW_BOOST }
      }
    }
  end

  def client_only
    { match: { 'legacy_descriptor.legacy_table_name': 'CLIENT_T' } }
  end

  def auto_bar_highlight
    { 'matched_fields':
      ['autocomplete_search_bar',
       'autocomplete_search_bar.phonetic',
       'autocomplete_search_bar.diminutive'] }
  end

  def highlight
    { order: 'score',
      number_of_fragments: NUMBER_OF_FRAGMENTS,
      require_field_match: REQUIRE_FIELD_MATCH,
      fields: {
        'autocomplete_search_bar': auto_bar_highlight,
        'searchable_date_of_birth': {}
      } }
  end
end
