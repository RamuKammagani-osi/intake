# frozen_string_literal: true

# class for dora search
class QueryBuilder < BaseQueryBuilder
  def self.build_base(builder)
    if builder.client_id_searched?
      builder.extend(PersonSearchByClientId).build_query(builder)
    elsif builder.ssn_searched?
      builder.extend(PersonSearchSsnQueryBuilder).build_query(builder)
    elsif builder.advanced_search_on?
      build_advanced_search(builder)
    else
      builder.extend(PersonSearchQueryBuilder).build_query(builder)
    end
  end

  def self.build_advanced_search(builder)
    advanced_search_by_name_query(builder)
    advanced_search_by_age_query(builder)
    builder.extend(PersonSearchBySexAtBirth).build_query(builder)
  end

  def self.advanced_search_by_name_query(builder)
    if builder.last_name_only?
      builder.extend(PersonSearchByLastNameQueryBuilder).build_query(builder)
    else
      builder.extend(PersonSearchByNameQueryBuilderPartOne).build_query(builder)
      builder.extend(PersonSearchByNameQueryBuilderPartTwo).build_query(builder)
    end
  end

  def self.advanced_search_by_age_query(builder)
    if builder.age_search_method == 'dob'
      builder.extend(PersonSearchByDateOfBirthQueryBuilder).build_query(builder)
    elsif builder.age_search_method == 'approximate'
      builder.extend(PersonSearchByApproximateAgeQueryBuilder).build_query(builder)
    end
  end
end
