# frozen_string_literal: true

require 'rails_helper'

describe PersonSearchRepository do
  let(:token) { 'token' }
  let(:session) do
    { token: token }
  end
  let(:request_id) { 'my_request_id' }
  let(:params) do
    {
      search_term: 'hello world'
    }
  end
  let(:participant) do
    {
      first_name: 'hello',
      last_name: 'world',
      legacy_descriptor: { legacy_id: id }
    }
  end

  describe '.search' do
    context 'when response from DORA is successful' do
      it 'returns status 200' do
        stub_request(:post, dora_api_url(ExternalRoutes.dora_people_light_index_path))
          .and_return(json_body(['hello world'], status: 200))
        result = described_class.search(params, request_id, session: session)
        expect(result).to eq ['hello world']
      end
    end

    context 'when response from DORA is unsuccessful' do
      it 'raise error when status not 200' do
        stub_request(:post, dora_api_url(ExternalRoutes.dora_people_light_index_path))
          .and_return(json_body(['Created'], status: 201))

        expect do
          described_class.search(params, request_id, session: session)
        end.to raise_error(TypeError)
      end
    end
  end

  describe '.find' do
    let(:id) { '123456788' }
    let(:hits) do
      { 'hits' => { 'hits' => [{ '_source' => { 'id' => id } }] } }
    end

    context 'searching with no id' do
      it 'raises an error' do
        stub_request(:post, dora_api_url(ExternalRoutes.dora_people_light_index_path))
          .and_return(json_body(hits.to_json, status: 200))

        expect do
          described_class.find(nil, request_id, token: token)
        end.to raise_error('id is required')
      end
    end

    context 'searching with an id' do
      it 'returns the existing person' do
        stub_request(:get, ferb_api_url(FerbRoutes.participants_path(id)))
          .and_return(json_body(participant.to_json, status: 200))

        result = described_class.find(id, request_id, token: token)
        expect(result.body.dig('legacy_descriptor', 'legacy_id')).to eq id
      end
    end
  end
end
