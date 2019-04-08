# frozen_string_literal: true

# rubocop:disable Metrics/ModuleLength
module PersonSearchNameQueryBuilderHelper
  def full_name_query
    {
      "size": '10',
      "track_scores": 'true',
      "sort": [
        {
          "_score": 'desc',
          "_uid": 'desc'
        }
      ],
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "legacy_descriptor.legacy_table_name": 'CLIENT_T'
              }
            }
          ],
          "should": [
            {
              "query_string": {
                "boost": '20',
                "default_field": 'last_name',
                "query": 'last name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'first_name',
                "query": 'first name'
              }
            },
            {
              "query_string": {
                "boost": '2',
                "default_field": 'middle_name',
                "query": 'middle name'
              }
            },
            {
              "query_string": {
                "boost": '2',
                "default_field": 'last_name.phonetic',
                "query": 'last name'
              }
            },
            {
              "query_string": {
                "boost": '2',
                "default_field": 'first_name.phonetic',
                "query": 'first name'
              }
            },
            {
              "query_string": {
                "boost": '2',
                "default_field": 'middle_name.phonetic',
                "query": 'middle name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'last_name.diminutive',
                "query": 'last name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'first_name.diminutive',
                "query": 'first name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'middle_name.diminutive',
                "query": 'middle name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'name_suffix',
                "query": 'suffix'
              }
            },
            {
              "multi_match": {
                "query": 'last name first name',
                "type": 'cross_fields',
                "fields": %w[first_name last_name],
                "operator": 'and',
                "boost": '14'
              }
            },
            {
              "match": {
                "first_name": {
                  "query": 'first name',
                  "operator": 'and',
                  "boost": '4',
                  "fuzziness": '3'
                }
              }
            }
          ]
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end

  def last_name_query
    {
      "size": '10',
      "track_scores": 'true',
      "sort": [
        {
          "_score": 'desc',
          "_uid": 'desc'
        }
      ],
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "legacy_descriptor.legacy_table_name": 'CLIENT_T'
              }
            }
          ],
          "should": [
            {
              "query_string": {
                "boost": '20',
                "default_field": 'last_name',
                "query": 'last name'
              }
            },
            {
              "query_string": {
                "boost": '2',
                "default_field": 'last_name.phonetic',
                "query": 'last name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'last_name.diminutive',
                "query": 'last name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'name_suffix',
                "query": 'suffix'
              }
            }
          ]
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end

  def first_name_query
    {
      "size": '10',
      "track_scores": 'true',
      "sort": [
        {
          "_score": 'desc',
          "_uid": 'desc'
        }
      ],
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "legacy_descriptor.legacy_table_name": 'CLIENT_T'
              }
            }
          ],
          "should": [
            {
              "query_string": {
                "boost": '4',
                "default_field": 'first_name',
                "query": 'first name'
              }
            },
            {
              "query_string": {
                "boost": '2',
                "default_field": 'first_name.phonetic',
                "query": 'first name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'first_name.diminutive',
                "query": 'first name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'name_suffix',
                "query": 'suffix'
              }
            },
            {
              "match": {
                "first_name": {
                  "query": 'first name',
                  "operator": 'and',
                  "boost": '4',
                  "fuzziness": '3'
                }
              }
            }
          ]
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end

  def full_name_dob_query
    {
      "size": '10',
      "track_scores": 'true',
      "sort": [
        {
          "_score": 'desc',
          "_uid": 'desc'
        }
      ],
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "legacy_descriptor.legacy_table_name": 'CLIENT_T'
              }
            },
            {
              "query_string": {
                "default_field": 'date_of_birth_as_text',
                "query": '05051989',
                "boost": '14'
              }
            }
          ],
          "should": [
            {
              "query_string": {
                "boost": '20',
                "default_field": 'last_name',
                "query": 'last name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'first_name',
                "query": 'first name'
              }
            },
            {
              "query_string": {
                "boost": '2',
                "default_field": 'middle_name',
                "query": 'middle name'
              }
            },
            {
              "query_string": {
                "boost": '2',
                "default_field": 'last_name.phonetic',
                "query": 'last name'
              }
            },
            {
              "query_string": {
                "boost": '2',
                "default_field": 'first_name.phonetic',
                "query": 'first name'
              }
            },
            {
              "query_string": {
                "boost": '2',
                "default_field": 'middle_name.phonetic',
                "query": 'middle name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'last_name.diminutive',
                "query": 'last name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'first_name.diminutive',
                "query": 'first name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'middle_name.diminutive',
                "query": 'middle name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'name_suffix',
                "query": 'suffix'
              }
            },
            {
              "multi_match": {
                "query": 'last name first name',
                "type": 'cross_fields',
                "fields": %w[first_name last_name],
                "operator": 'and',
                "boost": '14'
              }
            },
            {
              "match": {
                "first_name": {
                  "query": 'first name',
                  "operator": 'and',
                  "boost": '4',
                  "fuzziness": '3'
                }
              }
            }
          ]
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end

  def full_name_approx_age_months_gender_query
    {
      "size": '10',
      "track_scores": 'true',
      "sort": [
        {
          "_score": 'desc',
          "_uid": 'desc'
        }
      ],
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "legacy_descriptor.legacy_table_name": 'CLIENT_T'
              }
            },
            {
              "range": {
                "date_of_birth": {
                  "gte": (Date.current - 12.months - 6.months).iso8601,
                  "lte": (Date.current - 12.months + 6.months).iso8601,
                  "format": 'yyyy-MM-dd'
                }
              }
            },
            {
              "query_string": {
                "default_field": 'gender',
                "query": 'female',
                "boost": '1'
              }
            }
          ],
          "should": [
            {
              "query_string": {
                "boost": '20',
                "default_field": 'last_name',
                "query": 'last name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'first_name',
                "query": 'first name'
              }
            },
            {
              "query_string": {
                "boost": '2',
                "default_field": 'middle_name',
                "query": 'middle name'
              }
            },
            {
              "query_string": {
                "boost": '2',
                "default_field": 'last_name.phonetic',
                "query": 'last name'
              }
            },
            {
              "query_string": {
                "boost": '2',
                "default_field": 'first_name.phonetic',
                "query": 'first name'
              }
            },
            {
              "query_string": {
                "boost": '2',
                "default_field": 'middle_name.phonetic',
                "query": 'middle name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'last_name.diminutive',
                "query": 'last name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'first_name.diminutive',
                "query": 'first name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'middle_name.diminutive',
                "query": 'middle name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'name_suffix',
                "query": 'suffix'
              }
            },
            {
              "multi_match": {
                "query": 'last name first name',
                "type": 'cross_fields',
                "fields": %w[first_name last_name],
                "operator": 'and',
                "boost": '14'
              }
            },
            {
              "match": {
                "first_name": {
                  "query": 'first name',
                  "operator": 'and',
                  "boost": '4',
                  "fuzziness": '3'
                }
              }
            }
          ]
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end

  def full_name_approx_age_years_gender_query
    {
      "size": '10',
      "track_scores": 'true',
      "sort": [
        {
          "_score": 'desc',
          "_uid": 'desc'
        }
      ],
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "legacy_descriptor.legacy_table_name": 'CLIENT_T'
              }
            },
            {
              "range": {
                "date_of_birth": {
                  "gte": (Date.current - 100.years - 5.years).iso8601,
                  "lte": (Date.current - 100.years + 5.years).iso8601,
                  "format": 'yyyy-MM-dd'
                }
              }
            },
            {
              "query_string": {
                "default_field": 'gender',
                "query": 'male',
                "boost": '1'
              }
            }
          ],
          "should": [
            {
              "query_string": {
                "boost": '20',
                "default_field": 'last_name',
                "query": 'last name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'first_name',
                "query": 'first name'
              }
            },
            {
              "query_string": {
                "boost": '2',
                "default_field": 'middle_name',
                "query": 'middle name'
              }
            },
            {
              "query_string": {
                "boost": '2',
                "default_field": 'last_name.phonetic',
                "query": 'last name'
              }
            },
            {
              "query_string": {
                "boost": '2',
                "default_field": 'first_name.phonetic',
                "query": 'first name'
              }
            },
            {
              "query_string": {
                "boost": '2',
                "default_field": 'middle_name.phonetic',
                "query": 'middle name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'last_name.diminutive',
                "query": 'last name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'first_name.diminutive',
                "query": 'first name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'middle_name.diminutive',
                "query": 'middle name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'name_suffix',
                "query": 'suffix'
              }
            },
            {
              "multi_match": {
                "query": 'last name first name',
                "type": 'cross_fields',
                "fields": %w[first_name last_name],
                "operator": 'and',
                "boost": '14'
              }
            },
            {
              "match": {
                "first_name": {
                  "query": 'first name',
                  "operator": 'and',
                  "boost": '4',
                  "fuzziness": '3'
                }
              }
            }
          ]
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end

  def full_name_dob_address_query
    {
      "size": '10',
      "track_scores": 'true',
      "sort": [
        {
          "_score": 'desc',
          "_uid": 'desc'
        }
      ],
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "legacy_descriptor.legacy_table_name": 'CLIENT_T'
              }
            },
            {
              "query_string": {
                "default_field": 'date_of_birth_as_text',
                "query": '05051989',
                "boost": '14'
              }
            }
          ],
          "should": [
            {
              "query_string": {
                "boost": '20',
                "default_field": 'last_name',
                "query": 'last name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'first_name',
                "query": 'first name'
              }
            },
            {
              "query_string": {
                "boost": '2',
                "default_field": 'middle_name',
                "query": 'middle name'
              }
            },
            {
              "query_string": {
                "boost": '2',
                "default_field": 'last_name.phonetic',
                "query": 'last name'
              }
            },
            {
              "query_string": {
                "boost": '2',
                "default_field": 'first_name.phonetic',
                "query": 'first name'
              }
            },
            {
              "query_string": {
                "boost": '2',
                "default_field": 'middle_name.phonetic',
                "query": 'middle name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'last_name.diminutive',
                "query": 'last name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'first_name.diminutive',
                "query": 'first name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'middle_name.diminutive',
                "query": 'middle name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'name_suffix',
                "query": 'suffix'
              }
            },
            {
              "multi_match": {
                "query": 'last name first name',
                "type": 'cross_fields',
                "fields": %w[first_name last_name],
                "operator": 'and',
                "boost": '14'
              }
            },
            {
              "match": {
                "first_name": {
                  "query": 'first name',
                  "operator": 'and',
                  "boost": '4',
                  "fuzziness": '3'
                }
              }
            },
            {
              "nested": {
                "path": 'addresses',
                "query": {
                  "bool": {
                    "should": [
                      {
                        "match": {
                          "addresses.autocomplete_searchable_address": {
                            "boost": '14',
                            "operator": 'and',
                            "query": 'street_number_and_name_search_term'
                          }
                        }
                      },
                      {
                        "match": {
                          "addresses.last_known": {
                            "boost": '14',
                            "query": 'true'
                          }
                        }
                      },
                      {
                        "match": {
                          "addresses.autocomplete_city": {
                            "boost": '14',
                            "query": 'city_search_term'
                          }
                        }
                      },
                      {
                        "match": {
                          "addresses.county.description": {
                            "boost": '14',
                            "query": 'county_search_term'
                          }
                        }
                      },
                      {
                        "match": {
                          "addresses.searchable_address": {
                            "boost": '14',
                            "query": 'street_number_and_name_search_term'
                          }
                        }
                      },
                      {
                        "match": {
                          "addresses.city": {
                            "boost": '14',
                            "query": 'city_search_term'
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          ]
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end

  def last_name_dob_address_query
    {
      "size": '10',
      "track_scores": 'true',
      "sort": [
        {
          "_score": 'desc',
          "_uid": 'desc'
        }
      ],
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "legacy_descriptor.legacy_table_name": 'CLIENT_T'
              }
            },
            {
              "query_string": {
                "default_field": 'date_of_birth_as_text',
                "query": '05051989',
                "boost": '14'
              }
            }
          ],
          "should": [
            {
              "query_string": {
                "boost": '20',
                "default_field": 'last_name',
                "query": 'last name'
              }
            },
            {
              "query_string": {
                "boost": '2',
                "default_field": 'last_name.phonetic',
                "query": 'last name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'last_name.diminutive',
                "query": 'last name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'name_suffix',
                "query": 'suffix'
              }
            },
            {
              "nested": {
                "path": 'addresses',
                "query": {
                  "bool": {
                    "should": [
                      {
                        "match": {
                          "addresses.autocomplete_searchable_address": {
                            "boost": '14',
                            "operator": 'and',
                            "query": 'street_number_and_name_search_term'
                          }
                        }
                      },
                      {
                        "match": {
                          "addresses.last_known": {
                            "boost": '14',
                            "query": 'true'
                          }
                        }
                      },
                      {
                        "match": {
                          "addresses.autocomplete_city": {
                            "boost": '14',
                            "query": 'city_search_term'
                          }
                        }
                      },
                      {
                        "match": {
                          "addresses.county.description": {
                            "boost": '14',
                            "query": 'county_search_term'
                          }
                        }
                      },
                      {
                        "match": {
                          "addresses.searchable_address": {
                            "boost": '14',
                            "query": 'street_number_and_name_search_term'
                          }
                        }
                      },
                      {
                        "match": {
                          "addresses.city": {
                            "boost": '14',
                            "query": 'city_search_term'
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          ]
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end

  def first_name_dob_address_query
    {
      "size": '10',
      "track_scores": 'true',
      "sort": [
        {
          "_score": 'desc',
          "_uid": 'desc'
        }
      ],
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "legacy_descriptor.legacy_table_name": 'CLIENT_T'
              }
            },
            {
              "query_string": {
                "default_field": 'date_of_birth_as_text',
                "query": '05051989',
                "boost": '14'
              }
            }
          ],
          "should": [
            {
              "query_string": {
                "boost": '4',
                "default_field": 'first_name',
                "query": 'first name'
              }
            },
            {
              "query_string": {
                "boost": '2',
                "default_field": 'first_name.phonetic',
                "query": 'first name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'first_name.diminutive',
                "query": 'first name'
              }
            },
            {
              "query_string": {
                "boost": '4',
                "default_field": 'name_suffix',
                "query": 'suffix'
              }
            },
            {
              "match": {
                "first_name": {
                  "query": 'first name',
                  "operator": 'and',
                  "boost": '4',
                  "fuzziness": '3'
                }
              }
            },
            {
              "nested": {
                "path": 'addresses',
                "query": {
                  "bool": {
                    "should": [
                      {
                        "match": {
                          "addresses.autocomplete_searchable_address": {
                            "boost": '14',
                            "operator": 'and',
                            "query": 'street_number_and_name_search_term'
                          }
                        }
                      },
                      {
                        "match": {
                          "addresses.last_known": {
                            "boost": '14',
                            "query": 'true'
                          }
                        }
                      },
                      {
                        "match": {
                          "addresses.autocomplete_city": {
                            "boost": '14',
                            "query": 'city_search_term'
                          }
                        }
                      },
                      {
                        "match": {
                          "addresses.county.description": {
                            "boost": '14',
                            "query": 'county_search_term'
                          }
                        }
                      },
                      {
                        "match": {
                          "addresses.searchable_address": {
                            "boost": '14',
                            "query": 'street_number_and_name_search_term'
                          }
                        }
                      },
                      {
                        "match": {
                          "addresses.city": {
                            "boost": '14',
                            "query": 'city_search_term'
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          ]
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end
end