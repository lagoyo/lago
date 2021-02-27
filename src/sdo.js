import SDOAdapter from 'schema-org-adapter'

export default {
  ready: false,
  sdo: new SDOAdapter(),
  sdoClasses: null,
  fetch: async function () {
    const urlLatestSDO = await this.sdo.constructSDOVocabularyURL('latest', 'all-layers')
    // resolves to "https://raw.githubusercontent.com/schemaorg/schemaorg/master/data/releases/6.0/all-layers.jsonld" if 6.0 is the latest version
    await this.sdo.addVocabularies([urlLatestSDO])
    const temp = this.sdo.getListOfClasses().sort()
    this.sdoClasses = temp.map(function (x) {
      return {
        value: x,
        name: x.split(':')[1]
      }
    })
    this.ready = true
    console.log('fetch SDO', this.sdoClasses)
    // this.sdoClasses = sdoClasses
    //   sdoClasses: sdoClasses
    // }
    // console.log('fetch called')
    // initSdo().then((response) => {
    //   console.log('in install', response)
    //   shared.sdo = response.sdo
    //   shared.sdoClasses = response.sdoClasses
    //   shared.ready = true
    //   return response
    // })
  }
}
