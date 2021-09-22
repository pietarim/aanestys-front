import { gql, useQuery } from '@apollo/client';

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
  mutation ehdotus($ehdotusInfo: EhdotusInput) {
    ehdotus(ehdotus: $ehdotusInfo)
  }
`

export const AANESTA = gql`
    mutation aanesta($aaniInfo: AaniInput) {
        aanestaminen(aani: $aaniInfo)
    }
  `

  const SAVE_ROCKET = gql`
  mutation saveRocket($rocket: RocketInput!) {
    saveRocket(rocket: $rocket)
  }
`