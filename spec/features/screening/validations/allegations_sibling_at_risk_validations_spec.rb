# frozen_string_literal: true

require 'rails_helper'

feature 'Allegations Sibling At Risk Validations' do
  let(:sibling_at_risk_error) do
    'Any allegations of Sibling at Risk must be accompanied by another allegation.'
  end
  let(:perpetrator) { FactoryBot.create(:participant, :perpetrator) }
  let(:perpetrator2) { FactoryBot.create(:participant, :perpetrator) }
  let(:victim) { FactoryBot.create(:participant, :victim) }
  let(:victim2) { FactoryBot.create(:participant, :victim) }
  let(:screening) do
    {
      id: '1',
      incident_address: {},
      addresses: [],
      cross_reports: [],
      safety_alerts: [],
      participants: [
        perpetrator.as_json.symbolize_keys,
        perpetrator2.as_json.symbolize_keys,
        victim.as_json.symbolize_keys,
        victim2.as_json.symbolize_keys
      ],
      allegations: []
    }
  end

  context 'when allegations have no types' do
    let(:allegations) do
      [{
        id: '1',
        victim_person_id: victim.id,
        perpetrator_person_id: perpetrator.id,
        screening_id: screening[:id],
        types: []
      }, {
        id: '2',
        victim_person_id: victim2.id,
        perpetrator_person_id: perpetrator.id,
        screening_id: screening[:id],
        types: ['General neglect']
      }]
    end

    before do
      # screening[:allegations] = allegations
      stub_and_visit_edit_screening(screening)
    end

    scenario 'User sees no sibling error' do
      within '.card.edit', text: 'Allegations' do
        expect(page).not_to have_content(sibling_at_risk_error)
        click_button 'Cancel'
      end

      within '.card.show', text: 'Allegations' do
        expect(page).not_to have_content(sibling_at_risk_error)
        click_link 'Edit'
      end
    end

    scenario 'User sees error when adding at risk allegation' do
      stub_request(:put,
        ferb_api_url(FerbRoutes.screening_participant_path(screening[:id], victim.id)))
        .and_return(json_body(victim.to_json, status: 200))

      within '.card.edit', text: 'Allegations' do
        fill_in_react_select "allegations_#{victim.id}_#{perpetrator.id}",
          with: 'At risk, sibling abused'
        allegation = allegations.first
        allegation[:types] = ['At risk, sibling abused']
        expect(page).to have_content(sibling_at_risk_error)
        stub_screening_put_request_with_anything_and_return(
          screening,
          with_updated_attributes: {
            allegations: [{
              types: allegation[:types],
              victim_person_id: allegation[:victim_person_id],
              perpetrator_person_id: allegation[:perpetrator_person_id],
              screening_id: screening[:id]
            }]
          }
        )

        blur_field # "allegations_#{victim.id}_#{perpetrator.id}"

        click_button 'Save'
      end

      within '.card.show', text: 'Allegations' do
        expect(page).to have_content(sibling_at_risk_error)
        click_link 'Edit'
      end
    end

    scenario 'User can make the error go away' do
      within '.card.edit', text: 'Allegations' do
        fill_in_react_select "allegations_#{victim.id}_#{perpetrator.id}",
          with: 'At risk, sibling abused'
        expect(page).to have_content(sibling_at_risk_error)

        fill_in_react_select "allegations_#{victim2.id}_#{perpetrator.id}",
          with: 'General neglect'
        expect(page).not_to have_content(sibling_at_risk_error)
        allegations.first[:types] = ['At risk, sibling abused']
        allegations.second[:types] = ['General neglect']
        stub_screening_put_request_with_anything_and_return(
          screening,
          with_updated_attributes: {
            allegations: allegations.collect do |allegation|
              {
                types: allegation[:types],
                victim_person_id: allegation[:victim_person_id],
                perpetrator_person_id: allegation[:perpetrator_person_id],
                screening_id: screening[:id]
              }
            end
          }
        )

        blur_field # "allegations_#{victim2.id}_#{perpetrator.id}"

        click_button 'Save'
      end

      within '.card.show', text: 'Allegations' do
        expect(page).not_to have_content(sibling_at_risk_error)
      end
    end
  end

  context 'when allegations have only sibling at risk' do
    let(:allegations) do
      [{
        id: '1',
        victim_person_id: victim.id,
        perpetrator_person_id: perpetrator.id,
        screening_id: screening[:id],
        types: ['At risk, sibling abused']
      }, {
        id: '2',
        victim_person_id: victim2.id,
        perpetrator_person_id: perpetrator.id,
        screening_id: screening[:id],
        types: ['At risk, sibling abused']
      }]
    end

    before do
      screening[:allegations] = allegations
      stub_and_visit_edit_screening(screening)
    end

    scenario 'User sees warning about sibling at risk' do
      within '.card.edit', text: 'Allegations' do
        expect(page).to have_content(sibling_at_risk_error)
        click_button 'Cancel'
      end

      within '.card.show', text: 'Allegations' do
        expect(page).to have_content(sibling_at_risk_error)
        click_link 'Edit'
      end
    end

    scenario 'User can fix warning about at risk' do
      within '.card.edit', text: 'Allegations' do
        expect(page).to have_content(sibling_at_risk_error)
        fill_in_react_select "allegations_#{victim.id}_#{perpetrator.id}", with: 'Physical abuse'
        expect(page).to have_content(sibling_at_risk_error)
        fill_in_react_select "allegations_#{victim2.id}_#{perpetrator.id}", with: 'General neglect'
        expect(page).not_to have_content(sibling_at_risk_error)
        allegations.first[:types] = ['At risk, sibling abused', 'Physical abuse']
        allegations.second[:types] = ['At risk, sibling abused', 'General neglect']
        stub_screening_put_request_with_anything_and_return(
          screening,
          with_updated_attributes: {
            allegations: allegations.collect do |allegation|
              {
                types: allegation[:types],
                victim_person_id: allegation[:victim_person_id],
                perpetrator_person_id: allegation[:perpetrator_person_id],
                screening_id: screening[:id]
              }
            end
          }
        )

        blur_field # "allegations_#{victim2.id}_#{perpetrator.id}"

        click_button 'Save'
      end

      within '.card.show', text: 'Allegations' do
        expect(page).not_to have_content(sibling_at_risk_error)
      end
    end
  end

  context 'when some have sibling at risk and other with abuse' do
    let(:allegations) do
      [{
        id: '1',
        victim_person_id: victim.id,
        perpetrator_person_id: perpetrator.id,
        screening_id: screening[:id],
        types: ['At risk, sibling abused']
      }, {
        id: '2',
        victim_person_id: victim2.id,
        perpetrator_person_id: perpetrator.id,
        screening_id: screening[:id],
        types: ['Physical abuse']
      }]
    end

    before do
      screening[:allegations] = allegations
      stub_and_visit_edit_screening(screening)
    end

    scenario 'User sees no warning about sibling at risk' do
      within '.card.edit', text: 'Allegations' do
        expect(page).not_to have_content(sibling_at_risk_error)
        click_button 'Cancel'
      end

      within '.card.show', text: 'Allegations' do
        expect(page).not_to have_content(sibling_at_risk_error)
      end
    end
  end

  context 'when one victim has multiple allegations against a perp and is at risk' do
    let(:allegations) do
      [{
        id: '1',
        victim_person_id: victim.id,
        perpetrator_person_id: perpetrator.id,
        screening_id: screening[:id],
        types: ['At risk, sibling abused', 'General neglect']
      }]
    end

    before do
      screening[:allegations] = allegations
      stub_and_visit_edit_screening(screening)
    end

    scenario 'User sees error about sibling at risk' do
      within '.card.edit', text: 'Allegations' do
        expect(page).to have_content(sibling_at_risk_error)
        click_button 'Cancel'
      end

      within '.card.show', text: 'Allegations' do
        expect(page).to have_content(sibling_at_risk_error)
      end
    end

    scenario 'User can fix error' do
      within '.card.edit', text: 'Allegations' do
        expect(page).to have_content(sibling_at_risk_error)
        fill_in_react_select "allegations_#{victim.id}_#{perpetrator.id}", with: 'Exploitation'
        expect(page).to have_content(sibling_at_risk_error)
        fill_in_react_select "allegations_#{victim2.id}_#{perpetrator.id}", with: 'Physical abuse'
        expect(page).not_to have_content(sibling_at_risk_error)
        allegations.first[:types] = [
          'At risk, sibling abused', 'General neglect', 'Exploitation'
        ]
        allegations << {
          id: '1',
          victim_person_id: victim2.id,
          perpetrator_person_id: perpetrator.id,
          screening_id: screening[:id],
          types: ['Physical abuse']
        }
        stub_screening_put_request_with_anything_and_return(
          screening,
          with_updated_attributes: {
            allegations: allegations.collect do |allegation|
              {
                types: allegation[:types],
                victim_person_id: allegation[:victim_person_id],
                perpetrator_person_id: allegation[:perpetrator_person_id],
                screening_id: screening[:id]
              }
            end
          }
        )

        blur_field # "allegations_#{victim2.id}_#{perpetrator.id}"

        click_button 'Save'
      end

      within '.card.show', text: 'Allegations' do
        expect(page).not_to have_content(sibling_at_risk_error)
      end
    end
  end

  context 'when two allegations against two perps for one victim who is marked at risk' do
    let(:allegations) do
      [{
        id: '1',
        victim_person_id: victim.id,
        perpetrator_person_id: perpetrator.id,
        screening_id: screening[:id],
        types: ['At risk, sibling abused', 'General neglect']
      }, {
        id: '2',
        victim_person_id: victim.id,
        perpetrator_person_id: perpetrator2.id,
        screening_id: screening[:id],
        types: ['Exploitation']
      }]
    end

    before do
      screening[:allegations] = allegations
      stub_and_visit_edit_screening(screening)
    end

    scenario 'User sees error about sibling at risk' do
      within '.card.edit', text: 'Allegations' do
        expect(page).to have_content(sibling_at_risk_error)
        click_button 'Cancel'
      end

      within '.card.show', text: 'Allegations' do
        expect(page).to have_content(sibling_at_risk_error)
      end
    end

    scenario 'User can fix error' do
      stub_request(:put,
        ferb_api_url(FerbRoutes.screening_participant_path(screening[:id], perpetrator.id)))
        .and_return(json_body(perpetrator.to_json, status: 200))
      stub_request(:put,
        ferb_api_url(FerbRoutes.screening_participant_path(screening[:id], victim2.id)))
        .and_return(json_body(victim2.to_json, status: 200))
      stub_request(:put,
        ferb_api_url(FerbRoutes.screening_participant_path(screening[:id], victim.id)))
        .and_return(json_body(victim.to_json, status: 200))

      new_allegation = {
        id: '1',
        victim_person_id: victim2.id,
        perpetrator_person_id: perpetrator.id,
        screening_id: screening[:id],
        types: ['Physical abuse']
      }

      within '.card.edit', text: 'Allegations' do
        expect(page).to have_content(sibling_at_risk_error)
        fill_in_react_select "allegations_#{victim2.id}_#{perpetrator.id}", with: 'Physical abuse'
        expect(page).not_to have_content(sibling_at_risk_error)
        allegations.first[:types] = ['At risk, sibling abused', 'General neglect']
        allegations.second[:types] = ['Exploitation', 'Physical abuse']
        allegations << new_allegation
        stub_screening_put_request_with_anything_and_return(
          screening,
          with_updated_attributes: {
            allegations: allegations.collect do |allegation|
              {
                types: allegation[:types],
                victim_person_id: allegation[:victim_person_id],
                perpetrator_person_id: allegation[:perpetrator_person_id],
                screening_id: screening[:id]
              }
            end
          }
        )

        blur_field # "allegations_#{victim2.id}_#{perpetrator.id}"

        click_button 'Save'
      end

      within '.card.show', text: 'Allegations' do
        expect(page).not_to have_content(sibling_at_risk_error)
      end
    end
  end
end
