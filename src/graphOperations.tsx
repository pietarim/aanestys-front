import { gql } from '@apollo/client'

export const LUOMINEN = gql`
  mutation luominen($otsikko: String!, $numero: String!, $vaiheet: [String!]!, $osallistujat: [String!]!) {
    lisaaTapahtuma( tapahtuma: {
      tapahtumaNimi: $otsikko,
      numero: $numero,
      vaiheet: $vaiheet,
      osallistujat: $osallistujat
    })
  }
`

export const HAE_KAIKKI = gql`
    query tapahtuma($accesTokenS: String!) { 
      dbKaikkiHaku(token: $accesTokenS) {
      otsikko
      _id
      osallistujat {
        nimi
        _id
      }
      vaiheet {
        otsikko
        ehdotukset {
          ehdotus
          aanet
          ehdottajaId
          _id
        }
        _id
      }
    } 
  }
  `

export const EHDOTA = gql`
  mutation ehdottaminen($ehdotusInfo: EhdotusInput!) {
    ehdottaminen(ehdotus: $ehdotusInfo)
  }
`

export const AANESTA = gql`
    mutation aanesta($aaniInfo: AaniInput!) {
        aanestaminen(aani: $aaniInfo)
    }
  `