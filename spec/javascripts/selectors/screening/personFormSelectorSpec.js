import {fromJS, List, Seq} from 'immutable'
import {
  getFilteredPersonRolesSelector,
  getPersonWithEditsSelector,
  getPeopleWithEditsSelector,
  getErrorsSelector,
  getNamesRequiredSelector,
  getPersonAlertErrorMessageSelector,
  getLastNameSelector,
  getFirstNameSelector,
  getTouchedFieldsForPersonSelector,
  getVisibleErrorsSelector,
  getSocialSecurityNumberSelector,
  getRolesSelector,
} from 'selectors/screening/personFormSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('personFormSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getPeopleWithEditsSelector', () => {
    it('returns formatted people object map', () => {
      const screening = {id: '123456'}
      const peopleForm = {
        one: {
          legacy_descriptor: {value: 'a legacy descriptor'},
          approximate_age: {value: ''},
          approximate_age_units: {value: ''},
          csec_types: {value: ['At Risk', 'Victim Before Foster Care']},
          csec_started_at: {value: '0/0/0000'},
          csec_ended_at: {value: '0/0/0000'},
          date_of_birth: {value: '13/0/-514'},
          first_name: {value: 'one'},
          gender: {value: 'known'},
          languages: {value: ['Ω', 'ß']},
          middle_name: {value: 'middle one'},
          last_name: {value: 'last one'},
          name_suffix: {value: 'suffix one'},
          phone_numbers: [
            {id: '123', number: {value: '1234567890'}, type: {value: 'Home'}},
            {id: null, number: {value: '0987654321'}, type: {value: 'Cell'}},
          ],
          addresses: [
            {
              id: 'ABC',
              street: {value: '1234 Nowhere Lane'},
              city: {value: 'Somewhereville'},
              state: {value: 'CA'},
              zip: {value: '55555'},
              type: {value: 'Home'},
              legacy_descriptor: {value: {legacy_id: 'A2'}},
            }, {
              id: null,
              street: {value: '9674 Somewhere Street'},
              city: {value: 'Nowhereville'},
              state: {value: 'CA'},
              zip: {value: '55555'},
              type: {value: 'Cell'},
            },
          ],
          roles: {value: ['a', 'b']},
          ssn: {value: '321456789'},
          sensitive: {value: true},
          sealed: {value: true},
          ethnicity: {
            hispanic_latino_origin: {value: 'Yes'},
            ethnicity_detail: {value: ['Mexican']},
          },
          races: {
            Abandoned: {value: true},
            White: {value: false},
          },
          race_details: {},
        },
        two: {
          legacy_descriptor: {value: 'a legacy descriptor'},
          approximate_age: {value: '1'},
          approximate_age_units: {value: 'year'},
          csec_types: {value: ['Victim Before Foster Care']},
          csec_started_at: {value: '1/1/1111'},
          csec_ended_at: {value: '1/1/1111'},
          date_of_birth: {value: ''},
          first_name: {value: 'two'},
          gender: {value: 'unknown'},
          languages: {value: []},
          middle_name: {value: 'middle two'},
          last_name: {value: 'last two'},
          name_suffix: {value: 'suffix two'},
          phone_numbers: [{id: null, number: {value: null}, type: {value: null}}],
          addresses: [{
            id: null,
            street: {value: null},
            city: {value: null},
            state: {value: null},
            zip: {value: null},
            type: {value: null},
          }],
          roles: {value: ['c']},
          ssn: {value: '321456789'},
          sensitive: {value: false},
          sealed: {value: false},
          ethnicity: {
            hispanic_latino_origin: {value: 'No'},
            ethnicity_detail: {value: ['Mexican']},
          },
          races: {
            White: {value: true},
            Asian: {value: true},
          },
          race_details: {
            White: {value: 'Fuzzy Triangle'},
            Asian: {value: 'Regular Circle'},
          },
        },
        three: {
          legacy_descriptor: {value: 'a legacy descriptor'},
          approximate_age: {value: ''},
          approximate_age_units: {value: 'days'},
          csec_types: {value: ['At Risk']},
          csec_started_at: {value: '2/2/2222'},
          csec_ended_at: {value: '2/2/2222'},
          date_of_birth: {value: ''},
          first_name: {value: 'three'},
          gender: {value: ''},
          languages: {value: ['']},
          middle_name: {value: 'middle three'},
          last_name: {value: 'last three'},
          name_suffix: {value: 'suffix three'},
          phone_numbers: [],
          addresses: [],
          roles: {value: []},
          ssn: {value: null},
          sensitive: {value: true},
          sealed: {value: true},
          ethnicity: {
            hispanic_latino_origin: {value: null},
            ethnicity_detail: {value: []},
          },
          races: {},
          race_details: {},
        },
      }
      const state = fromJS({peopleForm, screening})
      expect(getPeopleWithEditsSelector(state)).toEqualImmutable(fromJS({
        one: {
          id: 'one',
          legacy_descriptor: 'a legacy descriptor',
          screening_id: '123456',
          approximate_age: null,
          approximate_age_units: null,
          csec_types: ['At Risk', 'Victim Before Foster Care'],
          csec_started_at: '0/0/0000',
          csec_ended_at: '0/0/0000',
          date_of_birth: '13/0/-514',
          first_name: 'one',
          gender: 'known',
          languages: ['Ω', 'ß'],
          middle_name: 'middle one',
          last_name: 'last one',
          name_suffix: 'suffix one',
          phone_numbers: [
            {id: '123', number: '1234567890', type: 'Home'},
            {id: null, number: '0987654321', type: 'Cell'},
          ],
          addresses: [
            {id: 'ABC', street_address: '1234 Nowhere Lane', city: 'Somewhereville', state: 'CA', zip: '55555', type: 'Home', legacy_id: 'A2'},
            {id: null, street_address: '9674 Somewhere Street', city: 'Nowhereville', state: 'CA', zip: '55555', type: 'Cell', legacy_id: null},
          ],
          roles: ['a', 'b'],
          ssn: '321456789',
          sensitive: true,
          sealed: true,
          ethnicity: {
            hispanic_latino_origin: 'Yes',
            ethnicity_detail: ['Mexican'],
          },
          races: [
            {race: 'Abandoned', race_detail: null},
          ],
        },
        two: {
          id: 'two',
          legacy_descriptor: 'a legacy descriptor',
          screening_id: '123456',
          approximate_age: '1',
          approximate_age_units: 'year',
          csec_types: ['Victim Before Foster Care'],
          csec_started_at: '1/1/1111',
          csec_ended_at: '1/1/1111',
          date_of_birth: '',
          first_name: 'two',
          gender: 'unknown',
          languages: [],
          middle_name: 'middle two',
          last_name: 'last two',
          name_suffix: 'suffix two',
          phone_numbers: [{id: null, number: null, type: null}],
          addresses: [{id: null, street_address: null, city: null, state: null, zip: null, type: null, legacy_id: null}],
          roles: ['c'],
          ssn: '321456789',
          sensitive: false,
          sealed: false,
          ethnicity: {
            hispanic_latino_origin: 'No',
            ethnicity_detail: [],
          },
          races: [
            {race: 'White', race_detail: 'Fuzzy Triangle'},
            {race: 'Asian', race_detail: 'Regular Circle'},
          ],
        },
        three: {
          id: 'three',
          legacy_descriptor: 'a legacy descriptor',
          screening_id: '123456',
          approximate_age: '',
          approximate_age_units: 'days',
          csec_types: ['At Risk'],
          csec_started_at: '2/2/2222',
          csec_ended_at: '2/2/2222',
          date_of_birth: '',
          first_name: 'three',
          gender: '',
          languages: [''],
          middle_name: 'middle three',
          last_name: 'last three',
          name_suffix: 'suffix three',
          phone_numbers: [],
          addresses: [],
          roles: [],
          ssn: null,
          sensitive: true,
          sealed: true,
          ethnicity: {
            hispanic_latino_origin: null,
            ethnicity_detail: [],
          },
          races: [],
        },
      }))
    })

    it('it combines read only and editable addresses', () => {
      const screening = {id: '123456'}
      const participants = [
        {
          legacy_source_table: null,
          gender: 'male',
          addresses: [
            {
              legacy_source_table: null,
              zip: '95616',
              legacy_descriptor: null,
              city: 'Davis',
              state: 'CA',
              legacy_id: '65TT6lc0Qc',
              street_address: '123 Delaware Crossing',
              type: '31',
              id: '1782',
            },
          ],
          id: 'one',
        },
        {
          legacy_source_table: null,
          gender: 'female',
          addresses: [
            {
              legacy_source_table: null,
              zip: '00000',
              legacy_descriptor: null,
              city: 'Springston',
              state: 'CA',
              legacy_id: 'AAAi88',
              street_address: '227 fairway heavens',
              type: '99',
              id: '9999',
            },
          ],
          id: '9928',
        },
      ]

      const peopleForm = {
        one: {
          id: 'one',
          approximate_age: {value: '1'},
          approximate_age_units: {value: 'years'},
          csec_types: {value: []},
          csec_started_at: {value: ''},
          csec_ended_at: {value: ''},
          date_of_birth: {value: '13/0/-514'},
          first_name: {value: ''},
          gender: {value: ''},
          languages: {value: []},
          legacy_descriptor: {value: 'a legacy_descriptor'},
          middle_name: {value: ''},
          last_name: {value: ''},
          name_suffix: {value: ''},
          phone_numbers: [],
          addresses: [
            {
              id: '3',
              street: {value: '223 Van der Burgh Ave'},
              city: {value: 'Calistoga'},
              state: {value: 'CA'},
              zip: {value: '839893'},
              type: {value: 'Home'},
            },
          ],
          roles: {value: []},
          ssn: {value: ''},
          sensitive: {value: true},
          sealed: {value: true},
          ethnicity: {
            hispanic_latino_origin: {value: null},
            ethnicity_detail: {value: []},
          },
          races: {},
          race_details: {},
        },
      }
      const state = fromJS({peopleForm, screening, participants})
      expect(getPeopleWithEditsSelector(state)).toEqualImmutable(fromJS({
        one: {
          id: 'one',
          screening_id: '123456',
          approximate_age: null,
          approximate_age_units: null,
          csec_types: [],
          csec_started_at: '',
          csec_ended_at: '',
          date_of_birth: '13/0/-514',
          first_name: '',
          gender: '',
          languages: [],
          legacy_descriptor: 'a legacy_descriptor',
          middle_name: '',
          last_name: '',
          name_suffix: '',
          phone_numbers: [],
          addresses: [
            {
              legacy_source_table: null,
              zip: '95616',
              legacy_descriptor: null,
              city: 'Davis',
              state: 'CA',
              legacy_id: '65TT6lc0Qc',
              street_address: '123 Delaware Crossing',
              type: '31',
              id: '1782',
            },
            {
              id: '3',
              street_address: '223 Van der Burgh Ave',
              city: 'Calistoga',
              state: 'CA',
              zip: '839893',
              type: 'Home',
              legacy_id: null,
            },
          ],
          roles: [],
          ssn: '',
          sensitive: true,
          sealed: true,
          ethnicity: {
            hispanic_latino_origin: null,
            ethnicity_detail: [],
          },
          races: [],
        },
      }))
    })

    it('it clears aproximate age fields when date of birth is set', () => {
      const screening = {id: '123456'}
      const peopleForm = {
        one: {
          approximate_age: {value: '1'},
          approximate_age_units: {value: 'years'},
          csec_types: {value: ['At Risk']},
          csec_started_at: {value: '2/2/2222'},
          csec_ended_at: {value: '2/2/2222'},
          date_of_birth: {value: '13/0/-514'},
          first_name: {value: ''},
          gender: {value: ''},
          languages: {value: []},
          legacy_descriptor: {value: 'a legacy_descriptor'},
          middle_name: {value: ''},
          last_name: {value: ''},
          name_suffix: {value: ''},
          phone_numbers: [],
          addresses: [],
          roles: {value: []},
          ssn: {value: ''},
          sensitive: {value: true},
          sealed: {value: true},
          ethnicity: {
            hispanic_latino_origin: {value: null},
            ethnicity_detail: {value: []},
          },
          races: {},
          race_details: {},
        },
      }
      const state = fromJS({peopleForm, screening})
      expect(getPeopleWithEditsSelector(state)).toEqualImmutable(fromJS({
        one: {
          id: 'one',
          screening_id: '123456',
          approximate_age: null,
          approximate_age_units: null,
          csec_types: ['At Risk'],
          csec_started_at: '2/2/2222',
          csec_ended_at: '2/2/2222',
          date_of_birth: '13/0/-514',
          first_name: '',
          gender: '',
          languages: [],
          legacy_descriptor: 'a legacy_descriptor',
          middle_name: '',
          last_name: '',
          name_suffix: '',
          phone_numbers: [],
          addresses: [],
          roles: [],
          ssn: '',
          sensitive: true,
          sealed: true,
          ethnicity: {
            hispanic_latino_origin: null,
            ethnicity_detail: [],
          },
          races: [],
        },
      }))
    })
  })
  describe('getFilteredPersonRolesSelector', () => {
    const personId = 'one'
    describe('when a reporter role is arleady selected', () => {
      const state = fromJS({
        peopleForm: {
          [personId]: {roles: {value: ['Mandated Reporter']}},
        },
      })
      it('returns all roles with reporter roles disabled', () => {
        expect(getFilteredPersonRolesSelector(state, personId)).toEqualImmutable(fromJS([
          {label: 'Victim', value: 'Victim', disabled: false},
          {label: 'Perpetrator', value: 'Perpetrator', disabled: false},
          {label: 'Mandated Reporter', value: 'Mandated Reporter', disabled: true},
          {label: 'Non-mandated Reporter', value: 'Non-mandated Reporter', disabled: true},
          {label: 'Anonymous Reporter', value: 'Anonymous Reporter', disabled: true},
        ]))
      })
    })
    describe('when no reporter roles are selected', () => {
      const state = fromJS({
        peopleForm: {
          [personId]: {roles: {value: ['Victim']}},
        },
      })
      it('returns all roles not disabled', () => {
        expect(getFilteredPersonRolesSelector(state, personId)).toEqualImmutable(fromJS([
          {label: 'Victim', value: 'Victim', disabled: false},
          {label: 'Perpetrator', value: 'Perpetrator', disabled: false},
          {label: 'Mandated Reporter', value: 'Mandated Reporter', disabled: false},
          {label: 'Non-mandated Reporter', value: 'Non-mandated Reporter', disabled: false},
          {label: 'Anonymous Reporter', value: 'Anonymous Reporter', disabled: false},
        ]))
      })
    })
  })

  describe('getErrorsSelector', () => {
    describe('social security number', () => {
      it('must be 9 digits long', () => {
        const peopleForm = {one: {ssn: {value: '88756123'}}}
        const state = fromJS({peopleForm})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List(['Social security number must be 9 digits long.']))
      })

      it('does not count hyphens as part of the number length', () => {
        const peopleForm = {one: {ssn: {value: '887-56-123'}}}
        const state = fromJS({peopleForm})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List(['Social security number must be 9 digits long.']))
      })

      it('does not count underscores as part of the number length', () => {
        // our masked input uses underscores in the placeholder
        const peopleForm = {one: {ssn: {value: '8__-__-____'}}}
        const state = fromJS({peopleForm})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List(['Social security number must be 9 digits long.']))
      })

      it('cannot begin with 9.', () => {
        const peopleForm = {one: {ssn: {value: '987561234'}}}
        const state = fromJS({peopleForm})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List(['Social security number cannot begin with 9.']))
      })

      it('cannot begin with 666.', () => {
        const peopleForm = {one: {ssn: {value: '666561234'}}}
        const state = fromJS({peopleForm})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List(['Social security number cannot begin with 666.']))
      })

      it('cannot contain all 0s in the first group', () => {
        const peopleForm = {one: {ssn: {value: '000-56-1234'}}}
        const state = fromJS({peopleForm})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List(['Social security number cannot contain all 0s in a group.']))
      })

      it('cannot contain all 0s in second group', () => {
        const peopleForm = {one: {ssn: {value: '768-00-1234'}}}
        const state = fromJS({peopleForm})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List(['Social security number cannot contain all 0s in a group.']))
      })

      it('cannot contain all 0s in third group', () => {
        const peopleForm = {one: {ssn: {value: '768-56-0000'}}}
        const state = fromJS({peopleForm})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List(['Social security number cannot contain all 0s in a group.']))
      })

      it('only shows one error message related to all 0s in a group', () => {
        const peopleForm = {one: {ssn: {value: '000-00-0000'}}}
        const state = fromJS({peopleForm})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List(['Social security number cannot contain all 0s in a group.']))
      })

      it('can have multiple errors at the same time', () => {
        const peopleForm = {one: {ssn: {value: '666-00-'}}}
        const state = fromJS({peopleForm})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List([
            'Social security number must be 9 digits long.',
            'Social security number cannot begin with 666.',
            'Social security number cannot contain all 0s in a group.',
          ]))
      })

      it('does not return an error message for a valid number', () => {
        const peopleForm = {one: {ssn: {value: '767561234'}}}
        const state = fromJS({peopleForm})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List())
      })

      it('does not return an error message for a valid number that contains hyphens', () => {
        const peopleForm = {one: {ssn: {value: '323-56-4321'}}}
        const state = fromJS({peopleForm})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List())
      })

      it('does not return an error message if the current value is null', () => {
        const peopleForm = {one: {ssn: {value: null}}}
        const state = fromJS({peopleForm})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List())
      })
    })

    it('returns last name error if last name is empty and role includes Victim', () => {
      const peopleForm = {1: {first_name: {value: 'John', errors: []}, roles: {value: ['Victim']}}}
      const state = fromJS({peopleForm})
      expect(getErrorsSelector(state, '1').get('last_name').first()).toEqual('Please enter a last name.')
    })

    it('returns first name error if first name is empty and role includes Victim', () => {
      const peopleForm = {1: {last_name: {value: 'Smith', errors: []}, roles: {value: ['Victim']}}}
      const state = fromJS({peopleForm})
      expect(getErrorsSelector(state, '1').get('first_name').first()).toEqual('Please enter a first name.')
    })

    it('returns undefined if first name is not empty and role includes Victim', () => {
      const peopleForm = {1: {
        first_name: {value: 'John', errors: []},
        roles: {value: ['Victim']}}}
      const state = fromJS({peopleForm})
      expect(getErrorsSelector(state, '1').get('first_name').first()).toEqual(undefined)
    })

    it('returns undefined if last name is not empty and role includes Victim', () => {
      const peopleForm = {1: {
        last_name: {value: 'John', errors: []},
        roles: {value: ['Victim']}}}
      const state = fromJS({peopleForm})
      expect(getErrorsSelector(state, '1').get('last_name').first()).toEqual(undefined)
    })

    it('returns undefined if first name is empty and role does not include Victim', () => {
      const peopleForm = {1: {roles: {value: ['Some role']}}}
      const state = fromJS({peopleForm})
      expect(getErrorsSelector(state, '1').get('first_name').first()).toEqual(undefined)
    })

    it('returns undefined if last name is empty and role does not include Victim', () => {
      const peopleForm = {1: {roles: {value: ['Some role']}}}
      const state = fromJS({peopleForm})
      expect(getErrorsSelector(state, '1').get('last_name').first()).toEqual(undefined)
    })

    describe('roles in getErrorsSelector', () => {
      it('returns roles error if role includes Victim and date of birth or approximate age is empty', () => {
        const peopleForm = {1: {roles: {value: ['Victim'], errors: []}}}
        const state = fromJS({screeningInformationForm: {started_at: {value: '2018-01-31T00:24:22.007Z'}}, peopleForm})
        expect(getErrorsSelector(state, '1').get('roles').first()).toEqual('Alleged victims must be under 18 years old.')
      })

      it('does not return roles error if role includes Victim and date of birth is under 18', () => {
        const peopleForm = {1: {date_of_birth: {value: '12/24/2001'}, roles: {value: ['Victim'], errors: []}}}
        const state = fromJS({screeningInformationForm: {started_at: {value: '2018-01-31T00:24:22.007Z'}}, peopleForm})
        expect(getErrorsSelector(state, '1').get('roles')).toEqualImmutable(List())
      })

      it('returns roles error if role includes Victim and date of birth is over 18', () => {
        const peopleForm = {1: {date_of_birth: {value: '12/24/1996'}, roles: {value: ['Victim'], errors: []}}}
        const state = fromJS({screeningInformationForm: {started_at: {value: '2018-01-31T00:24:22.007Z'}}, peopleForm})
        expect(getErrorsSelector(state, '1').get('roles')).toEqualImmutable(List(['Alleged victims must be under 18 years old.']))
      })

      it('does not return roles error if role includes Victim and date of birth is in the future', () => {
        const peopleForm = {1: {date_of_birth: {value: '2/24/2018'}, roles: {value: ['Victim'], errors: []}}}
        const state = fromJS({screeningInformationForm: {started_at: {value: '2018-01-31T00:24:22.007Z'}}, peopleForm})
        expect(getErrorsSelector(state, '1').get('roles')).toEqualImmutable(List())
      })

      it('does not return roles error if role includes Victim and approximate age with units is under 18', () => {
        const peopleForm = {
          1: {approximate_age: {value: '17'}, approximate_age_units: {value: 'years'}, roles: {value: ['Victim'], errors: []}},
          2: {approximate_age: {value: '214'}, approximate_age_units: {value: 'months'}, roles: {value: ['Victim'], errors: []}},
          3: {approximate_age: {value: '923'}, approximate_age_units: {value: 'weeks'}, roles: {value: ['Victim'], errors: []}},
          4: {approximate_age: {value: '6522'}, approximate_age_units: {value: 'days'}, roles: {value: ['Victim'], errors: []}},
        }
        const state = fromJS({screeningInformationForm: {started_at: {value: '2018-01-31T00:24:22.007Z'}}, peopleForm})
        expect(getErrorsSelector(state, '1').get('roles')).toEqualImmutable(List([]))
        expect(getErrorsSelector(state, '2').get('roles')).toEqualImmutable(List([]))
        expect(getErrorsSelector(state, '3').get('roles')).toEqualImmutable(List([]))
        expect(getErrorsSelector(state, '4').get('roles')).toEqualImmutable(List([]))
      })

      it('returns roles error if role includes Victim and approximate age with units is under 18', () => {
        const peopleForm = {
          1: {approximate_age: {value: '18'}, approximate_age_units: {value: 'years'}, roles: {value: ['Victim'], errors: []}},
          2: {approximate_age: {value: '217'}, approximate_age_units: {value: 'months'}, roles: {value: ['Victim'], errors: []}},
          3: {approximate_age: {value: '940'}, approximate_age_units: {value: 'weeks'}, roles: {value: ['Victim'], errors: []}},
          4: {approximate_age: {value: '6575'}, approximate_age_units: {value: 'days'}, roles: {value: ['Victim'], errors: []}},
        }
        const state = fromJS({screeningInformationForm: {started_at: {value: '2018-01-31T00:24:22.007Z'}}, peopleForm})
        expect(getErrorsSelector(state, '1').get('roles')).toEqualImmutable(List(['Alleged victims must be under 18 years old.']))
        expect(getErrorsSelector(state, '2').get('roles')).toEqualImmutable(List(['Alleged victims must be under 18 years old.']))
        expect(getErrorsSelector(state, '3').get('roles')).toEqualImmutable(List(['Alleged victims must be under 18 years old.']))
        expect(getErrorsSelector(state, '4').get('roles')).toEqualImmutable(List(['Alleged victims must be under 18 years old.']))
      })
    })
  })

  describe('getRolesSelector', () => {
    it('returns roles with error if it has one', () => {
      const peopleForm = {
        1: {roles: {value: 'Victim', errors: []}},
      }
      const state = fromJS({peopleForm})
      expect(getRolesSelector(state, '1')).toEqualImmutable(fromJS(
        {
          value: 'Victim',
          errors: [],
        }))
    })
  })

  describe('getNamesRequiredSelector', () => {
    it('returns true if roles includes Victim', () => {
      const peopleForm = {1: {roles: {value: ['Victim', 'Some role']}}}
      const state = fromJS({peopleForm})
      expect(getNamesRequiredSelector(state, '1')).toEqual(true)
    })
  })

  describe('getPersonAlertErrorMessageSelector', () => {
    it('returns alert if roles includes Victim and firstName is empty', () => {
      const peopleForm = {1: {roles: {value: ['Victim', 'Some role']}, last_name: {value: 'Smith', errors: []}}}
      const state = fromJS({peopleForm})
      expect(getPersonAlertErrorMessageSelector(state, '1')).toEqual(
        'Alleged victims must be identified with a name, even Doe or Unknown, and must be under the age of 18')
    })

    it('returns alert if roles includes Victim and lastName is empty', () => {
      const peopleForm = {1: {roles: {value: ['Victim', 'Some role']}, first_name: {value: 'John', errors: []}}}
      const state = fromJS({peopleForm})
      expect(getPersonAlertErrorMessageSelector(state, '1')).toEqual(
        'Alleged victims must be identified with a name, even Doe or Unknown, and must be under the age of 18')
    })

    it('returns undefined if roles includes Victim and lastName and firstName is not empty', () => {
      const peopleForm = {1: {
        roles: {value: ['Victim', 'Some role']},
        first_name: {value: 'John', errors: []},
        last_name: {value: 'Smith', errors: []}}}
      const state = fromJS({peopleForm})
      expect(getPersonAlertErrorMessageSelector(state, '1')).toEqual(undefined)
    })
  })

  describe('getLastNameSelector', () => {
    it('returns last name', () => {
      const peopleForm = {
        1: {roles: {value: ['Victim', 'Some role']}, last_name: {value: 'Smith', errors: [], required: true}},
        2: {roles: {value: ['Other role', 'Some role']}, last_name: {value: 'Smith2', errors: [], required: false}}}
      const state = fromJS({peopleForm})
      expect(getLastNameSelector(state, '1')).toEqual(fromJS(
        {
          value: 'Smith',
          errors: [],
          required: true,
        }))
      expect(getLastNameSelector(state, '2')).toEqual(fromJS(
        {
          value: 'Smith2',
          errors: [],
          required: false,
        }))
    })
  })

  describe('getFirstNameSelector', () => {
    it('returns first name', () => {
      const peopleForm = {
        1: {roles: {value: ['Victim', 'Some role']}, first_name: {value: 'John', errors: [], required: true}},
        2: {roles: {value: ['Other role', 'Some role']}, first_name: {value: 'Jessy', errors: [], required: false}}}
      const state = fromJS({peopleForm})
      expect(getFirstNameSelector(state, '1')).toEqual(fromJS(
        {
          value: 'John',
          errors: [],
          required: true,
        }))
      expect(getFirstNameSelector(state, '2')).toEqual(fromJS(
        {
          value: 'Jessy',
          errors: [],
          required: false,
        }))
    })
  })

  describe('getSocialSecurityNumberSelector', () => {
    it('returns the social security number and any relevent errors', () => {
      const peopleForm = {
        1: {ssn: {value: '123-45-6789'}},
        2: {ssn: {value: '987-65-4321'}}}
      const state = fromJS({peopleForm})
      expect(getSocialSecurityNumberSelector(state, '1')).toEqual(fromJS(
        {
          value: '123-45-6789',
          errors: [],
        }))
    })
  })

  describe('getTouchedFieldsForPersonSelector', () => {
    it('returns the contactForm field names that are touched', () => {
      const peopleForm = {
        1: {
          fieldA: {touched: false},
          fieldB: {touched: true},
          fieldC: {},
          fieldD: {touched: true},
        }}
      const state = fromJS({peopleForm})
      expect(getTouchedFieldsForPersonSelector(state, '1')).toEqualImmutable(Seq(['fieldB', 'fieldD']))
    })

    it('returns empty list when no contact', () => {
      const peopleForm = {1: {}}
      const state = fromJS({peopleForm})
      expect(getTouchedFieldsForPersonSelector(state, '1')).toEqualImmutable(Seq())
    })
  })
  describe('getVisibleErrorsSelector', () => {
    it('returns an error if the first name has a validation and is touched', () => {
      const peopleForm = {
        1: {
          roles: {
            value: ['Victim'],
          },
          first_name: {
            value: undefined,
            touched: true,
          },
        },
      }
      const state = fromJS({peopleForm})
      expect(getVisibleErrorsSelector(state, '1').get('first_name'))
        .toEqualImmutable(List(['Please enter a first name.']))
    })
    it('returns an error if the last name has a validation and is touched', () => {
      const peopleForm = {
        1: {
          roles: {
            value: ['Victim'],
          },
          last_name: {
            value: undefined,
            touched: true,
          },
        },
      }
      const state = fromJS({peopleForm})
      expect(getVisibleErrorsSelector(state, '1').get('last_name'))
        .toEqualImmutable(List(['Please enter a last name.']))
    })

    it('does not return an error if the last name has not been touched', () => {
      const peopleForm = {
        1: {
          roles: {
            value: ['Victim'],
          },
          last_name: {
            value: undefined,
            touched: true,
          },
        },
      }
      const state = fromJS({peopleForm})
      expect(getVisibleErrorsSelector(state).get('last_name'))
        .toEqualImmutable(List())
    })
    it('does not return an error if the first name has not been touched', () => {
      const peopleForm = {
        1: {
          roles: {
            value: ['Victim'],
          },
          first_name: {
            value: undefined,
            touched: true,
          },
        },
      }
      const state = fromJS({peopleForm})
      expect(getVisibleErrorsSelector(state).get('first_name'))
        .toEqualImmutable(List())
    })
  })

  describe('getPersonWithEditsSelector', () => {
    const screening = {id: '123456', report_type: 'ssb'}
    const peopleForm = {
      one: {
        legacy_descriptor: {value: 'a legacy descriptor'},
        approximate_age: {value: ''},
        approximate_age_units: {value: ''},
        date_of_birth: {value: '13/0/-514'},
        first_name: {value: 'one'},
        gender: {value: 'known'},
        languages: {value: ['Ω', 'ß']},
        middle_name: {value: 'middle one'},
        last_name: {value: 'last one'},
        name_suffix: {value: 'suffix one'},
        phone_numbers: [
          {id: '123', number: {value: '1234567890'}, type: {value: 'Home'}},
          {id: null, number: {value: '0987654321'}, type: {value: 'Cell'}},
        ],
        addresses: [
          {
            id: 'ABC',
            street: {value: '1234 Nowhere Lane'},
            city: {value: 'Somewhereville'},
            state: {value: 'CA'},
            zip: {value: '55555'},
            type: {value: 'Home'},
            legacy_descriptor: {value: {legacy_id: 'A2'}},
          }, {
            id: null,
            street: {value: '9674 Somewhere Street'},
            city: {value: 'Nowhereville'},
            state: {value: 'CA'},
            zip: {value: '55555'},
            type: {value: 'Cell'},
          },
        ],
        roles: {value: ['a', 'b']},
        ssn: {value: '321456789'},
        sensitive: {value: true},
        sealed: {value: true},
        ethnicity: {
          hispanic_latino_origin: {value: 'Yes'},
          ethnicity_detail: {value: ['Mexican']},
        },
        races: {
          Abandoned: {value: true},
          White: {value: false},
        },
        race_details: {},
      },
      two: {
        legacy_descriptor: {value: 'a legacy descriptor'},
        approximate_age: {value: '1'},
        approximate_age_units: {value: 'year'},
        date_of_birth: {value: ''},
        first_name: {value: 'two'},
        gender: {value: 'unknown'},
        languages: {value: []},
        middle_name: {value: 'middle two'},
        last_name: {value: 'last two'},
        name_suffix: {value: 'suffix two'},
        phone_numbers: [{id: null, number: {value: null}, type: {value: null}}],
        addresses: [{
          id: null,
          street: {value: null},
          city: {value: null},
          state: {value: null},
          zip: {value: null},
          type: {value: null},
        }],
        roles: {value: ['c']},
        ssn: {value: '321456789'},
        sensitive: {value: false},
        sealed: {value: false},
        ethnicity: {
          hispanic_latino_origin: {value: 'No'},
          ethnicity_detail: {value: ['Mexican']},
        },
        races: {
          White: {value: true},
          Asian: {value: true},
        },
        race_details: {
          White: {value: 'Fuzzy Triangle'},
          Asian: {value: 'Regular Circle'},
        },
      },
      three: {
        legacy_descriptor: {value: 'a legacy descriptor'},
        approximate_age: {value: ''},
        approximate_age_units: {value: 'days'},
        date_of_birth: {value: ''},
        first_name: {value: 'three'},
        gender: {value: ''},
        languages: {value: ['']},
        middle_name: {value: 'middle three'},
        last_name: {value: 'last three'},
        name_suffix: {value: 'suffix three'},
        phone_numbers: [],
        addresses: [],
        roles: {value: []},
        ssn: {value: null},
        sensitive: {value: true},
        sealed: {value: true},
        ethnicity: {
          hispanic_latino_origin: {value: null},
          ethnicity_detail: {value: []},
        },
        races: {},
        race_details: {},
      },
    }
    const safelySurrenderedBaby = {
      persisted: {},
      form: {
        participant_child: 'two',
        surrendered_by: null,
        relation_to_child: '1592',
        bracelet_id: '12345',
        parent_guardian_given_bracelet_id: 'unknown',
        parent_guardian_provided_med_questionaire: 'unknown',
        comments: 'Comments and such!',
        med_questionaire_return_date: '2018-01-01',
      },
    }
    const state = fromJS({peopleForm, screening, safelySurrenderedBaby})

    it('returns formatted person object map', () => {
      const personId = 'one'
      expect(getPersonWithEditsSelector(state, personId)).toEqualImmutable(fromJS({
        id: 'one',
        legacy_descriptor: 'a legacy descriptor',
        screening_id: '123456',
        approximate_age: null,
        approximate_age_units: null,
        csec_types: undefined,
        csec_started_at: undefined,
        csec_ended_at: undefined,
        date_of_birth: '13/0/-514',
        first_name: 'one',
        gender: 'known',
        languages: ['Ω', 'ß'],
        middle_name: 'middle one',
        last_name: 'last one',
        name_suffix: 'suffix one',
        phone_numbers: [
          {id: '123', number: '1234567890', type: 'Home'},
          {id: null, number: '0987654321', type: 'Cell'},
        ],
        addresses: [
          {id: 'ABC', street_address: '1234 Nowhere Lane', city: 'Somewhereville', state: 'CA', zip: '55555', type: 'Home', legacy_id: 'A2'},
          {id: null, street_address: '9674 Somewhere Street', city: 'Nowhereville', state: 'CA', zip: '55555', type: 'Cell', legacy_id: null},
        ],
        roles: ['a', 'b'],
        ssn: '321456789',
        sensitive: true,
        sealed: true,
        ethnicity: {
          hispanic_latino_origin: 'Yes',
          ethnicity_detail: ['Mexican'],
        },
        races: [
          {race: 'Abandoned', race_detail: null},
        ],
      }))
    })

    it('returns undefined if person is not found', () => {
      const personId = 'four'
      expect(getPersonWithEditsSelector(state, personId)).toBe(null)
    })

    describe('ssb', () => {
      it('adds ssb info to participant children', () => {
        expect(getPersonWithEditsSelector(state, 'two').get('safelySurrenderedBabies'))
          .toEqualImmutable(fromJS({
            participant_child: 'two',
            surrendered_by: null,
            relation_to_child: '1592',
            bracelet_id: '12345',
            parent_guardian_given_bracelet_id: 'unknown',
            parent_guardian_provided_med_questionaire: 'unknown',
            comments: 'Comments and such!',
            med_questionaire_return_date: '2018-01-01',
          }))
      })

      it('does not add ssb if report_type is not ssb', () => {
        expect(
          getPersonWithEditsSelector(
            state.setIn(['screening', 'report_type'], 'csec'),
            'two'
          ).get('safelySurrenderedBabies')
        ).toBeUndefined()
      })
    })
  })
})
