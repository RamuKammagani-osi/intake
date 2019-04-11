import {isFeatureActive, isFeatureInactive, config, jsClipboardSupported, sdmPath, isAdvancedSearchOn, isSearchByAddressOn, isHotline, isSnapshot} from 'common/config'

describe('intake config', () => {
  let windowOrg
  beforeEach(() => { windowOrg = window.org })
  afterEach(() => { window.org = windowOrg })

  describe('.config', () => {
    beforeEach(() => {
      window.org = Object.freeze({intake: {config: {test_config: true}}})
    })

    it('references window org intake config', () => {
      expect(config()).toEqual({test_config: true})
    })
  })

  describe('.jsClipboardSupported', () => {
    it('true when clipboardData (IE specific) is absent', () => {
      window.clipboardData = {} // We can only spyOn methods that already exist
      expect(jsClipboardSupported()).toEqual(false)
      delete window.clipboardData
    })
    it('is true when clipboardData is missing', () => {
      expect(jsClipboardSupported()).toEqual(true)
    })
  })

  describe('.isFeatureActive', () => {
    describe('when a feature is present in active features', () => {
      beforeEach(() => {
        window.org = Object.freeze({intake: {config: {active_features: ['enabled_feature']}}})
      })

      it('returns true', () => {
        expect(isFeatureActive('enabled_feature')).toEqual(true)
      })
    })

    describe('when a feature is not present in active features', () => {
      beforeEach(() => {
        window.org = Object.freeze({intake: {config: {active_features: []}}})
      })

      it('returns false', () => {
        expect(isFeatureActive('enabled_feature')).toEqual(false)
      })
    })

    it('returns false when there is no config', () => {
      delete window.org
      expect(isFeatureActive('enabled_feature')).toEqual(false)
    })
  })

  describe('.isFeatureInactive', () => {
    describe('when a feature is present in active features', () => {
      beforeEach(() => {
        window.org = Object.freeze({intake: {config: {active_features: ['enabled_feature']}}})
      })

      it('returns false', () => {
        expect(isFeatureInactive('enabled_feature')).toEqual(false)
      })
    })

    describe('when a feature is not present in active features', () => {
      beforeEach(() => {
        window.org = Object.freeze({intake: {config: {active_features: []}}})
      })

      it('returns true', () => {
        expect(isFeatureInactive('enabled_feature')).toEqual(true)
      })
    })
  })

  describe('.sdmPath', () => {
    const sdmPathString = '/sdm-path-test'

    beforeEach(() => {
      window.org = Object.freeze({intake: {config: {sdm_path: sdmPathString}}})
    })

    it('returns the sdm path', () => {
      expect(sdmPath()).toEqual(sdmPathString)
    })
  })

  describe('isHotline', () => {
    it('returns false if pathname does not include /screenings', () => {
      expect(isHotline({pathname: '/'})).toEqual(false)
    })

    it('returns true if pathname includes /screenings', () => {
      expect(isHotline({pathname: '/screenings'})).toEqual(true)
    })
  })

  describe('isSnapshot', () => {
    it('returns false if pathname does not include /screenings', () => {
      expect(isSnapshot({pathname: '/'})).toEqual(false)
    })

    it('returns true if pathname includes /screenings', () => {
      expect(isSnapshot({pathname: '/snapshot'})).toEqual(true)
    })
  })

  describe('.isAdvancedSearchOn', () => {
    it('doesnot display advanced search when path includes screenings', () => {
      window.org = Object.freeze({intake: {config: {active_features: ['advanced_search']}}})
      expect(isAdvancedSearchOn({pathname: '/screenings/123/edit'})).toEqual(false)
    })

    it('display advanced search when path include snapshot', () => {
      window.org = Object.freeze({intake: {config: {active_features: ['advanced_search']}}})
      expect(isAdvancedSearchOn({pathname: '/snapshot'})).toEqual(true)
    })
  })

  describe('.isSearchByAddressOn', () => {
    it('returns based on hotline flag when path includes screenings', () => {
      window.org = Object.freeze({intake: {config: {active_features: ['address_search_hotline']}}})
      expect(isSearchByAddressOn({pathname: '/screenings/123/edit'})).toEqual(true)

      window.org = Object.freeze({intake: {config: {active_features: ['address_search_snapshot']}}})
      expect(isSearchByAddressOn({pathname: '/screenings/123/edit'})).toEqual(false)
    })

    it('returns based on snapshot flag when path does not include screenings', () => {
      window.org = Object.freeze({intake: {config: {active_features: ['address_search_hotline']}}})
      expect(isSearchByAddressOn({pathname: '/snapshot'})).toEqual(false)

      window.org = Object.freeze({intake: {config: {active_features: ['address_search_snapshot']}}})
      expect(isSearchByAddressOn({pathname: '/snapshot'})).toEqual(true)
    })
  })
})

describe('displayError', () => {
  it('return error as true', () => {
    const callDisplayError = window.displayError()
    expect(callDisplayError.error).toEqual(true)
  })
})
