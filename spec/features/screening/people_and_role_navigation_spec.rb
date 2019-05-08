# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'Create participant' do
  let(:existing_participant) { FactoryBot.create(:participant) }
  let(:existing_screening) do
    {
      id: '1',
      incident_address: {},
      addresses: [],
      cross_reports: [],
      allegations: [],
      safety_alerts: [],
      participants: [existing_participant.as_json.symbolize_keys]
    }
  end
  let(:marge) do
    FactoryBot.create(
      :participant,
      :with_complete_address,
      phone_numbers: [],
      middle_name: 'j',
      name_suffix: 'sr',
      ssn: '555-56-7895',
      sealed: false,
      sensitive: true,
      races: [
        { race: 'Asian', race_detail: 'Hmong' }
      ],
      roles: [],
      languages: ['English'],
      ethnicity: [{
        hispanic_latino_origin: 'Yes',
        ethnicity_detail: ['Mexican']
      }]
    )
  end
  let(:marge_response) do
    PersonSearchResponseBuilder.build do |response|
      response.with_total(1)
      response.with_hits do
        [
          PersonSearchResultBuilder.build do |builder|
            builder.with_first_name('Marge')
            builder.with_last_name('Simpson')
            builder.with_legacy_descriptor(marge.legacy_descriptor)
            builder.with_sensitivity
          end
        ]
      end
    end
  end
  before do
    stub_request(
      :get, ferb_api_url(FerbRoutes.intake_screening_path(existing_screening[:id]))
    ).and_return(json_body(existing_screening.to_json, status: 200))
    stub_person_search(person_response: marge_response)
    stub_empty_relationships
    stub_empty_history_for_screening(existing_screening)
  end

  scenario 'create and edit an unknown participant' do
    visit edit_screening_path(id: existing_screening[:id])

    stub_request(:post,
      ferb_api_url(FerbRoutes.screening_participant_path(existing_screening[:id])))
      .and_return(json_body(marge.to_json, status: 201))

    within '#search-card', text: 'Search' do
      fill_in 'Search for any person', with: 'Marge'
      click_button 'Create a new person'
      expect(page).to_not have_button('Create a new person')
    end
    stub_request(:put,
      ferb_api_url(FerbRoutes.screening_participant_path(existing_screening[:id], marge.id)))
      .and_return(json_body(marge.to_json, status: 200))

    within edit_participant_card_selector(marge.id) do
      click_button 'Save'
    end

    created_participant_unknown = FactoryBot.create(
      :participant, :unpopulated,
      screening_id: existing_screening[:id]
    )

    stub_request(:post,
      ferb_api_url(FerbRoutes.screening_participant_path(existing_screening[:id])))
      .and_return(json_body(created_participant_unknown.to_json, status: 201))

    within '#search-card', text: 'Search' do
      fill_in 'Search for any person', with: 'Marge'
      click_button 'Create a new person'
      expect(page).to_not have_button('Create a new person')
    end

    within edit_participant_card_selector(created_participant_unknown.id) do
      fill_in 'First Name', with: 'Second Person'
      expect(find_field('First Name').value).to eq('Second Person')
    end
  end
end
