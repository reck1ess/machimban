export const SERVER_BASE_URL = `https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1`;

export const STORES_BY_GEO_CODE = `storesByGeo/json?`;

export const STORES = `stores/json?`;

export const SALES = `sales/json?`;

export const APP_NAME = `마침반`;

export const HOME_TITLE = `홈`;

export const SET_KEYWORD = "SET_KEYWORD";

export const TOGGLE_FOCUS = "TOGGLE_FOCUS";

export const TOGGLE_PLENTY = "TOGGLE_PLENTY";

export const TOGGLE_SOME = "TOGGLE_SOME";

export const TOGGLE_FEW = "TOGGLE_FEW";

export const TOGGLE_EMPTY = "TOGGLE_EMPTY";

export const FILTER_LIST = ["plenty", "some", "few", "empty"];

export const DEFAULT_VIEWPORT_HEIGHT = 736;

export const KAKAO_MAP_URL = `https://dapi.kakao.com/v2/local/search/keyword.json`;

export const NETWORK_WARNING_MESSAGE =
  "네트워크 응답이 느립니다. 😔 조금만 여유를 가지고 기다려주세요.";

export const NETWORK_ERROR_MESSAGE =
  "앗! 문제가 발생했어요. 😥 잠시 후 새로고침 해주세요.";

export const FIRST_GUIDE_MESSAGE =
  "마침반의 공적마스크 재고 정보는 건강보험심사평가원에서 제공하는 공공데이터를 바탕으로 합니다. 판매처별로 시행되는 번호표 배부, 대기줄의 상황은 반영되지 않기 때문에 현장의 실제 재고 수량과 다를 수 있으니 참고 부탁드립니다.";

export const NETWORK_DELAY = 250;

export const SEARCH_INPUT_PLACEHOLDER = "장소, 주소, 지하철역 검색";

export const DEFAULT_POSITION = {
  lat: 37.5666103,
  lng: 126.9783882
};

export const INITIAL_SEARCH_STATE = {
  keyword: "",
  isFocus: false,
  plenty: true,
  some: true,
  few: false,
  empty: false
};

export const INITIAL_STORE_STATE = {
  code: "",
  name: "",
  addr: "",
  type: "",
  lat: 0,
  lng: 0,
  stock_at: "",
  remain_stat: "",
  created_at: ""
};

export const DEFAULT_GEOLOCATION_ERROR_MESSAGE = `위치 정보를 불러올 수 없습니다. GPS 옵션을 확인해주세요.`;

export const SAFARI_GEOLOCATION_ERROR_MESSAGE = `위치 정보 접근 권한을 거부하셨습니다. "아이폰 설정 > 개인정보보호 > 위치서비스 > Safari > 웹사이트 선택 > 사용하는 동안으로 변경"을 통해 위치 정보 접근 권한을 설정해주세요.`;

export const SAMSUNG_GEOLOCATION_ERROR_MESSAGE = `위치 정보 접근 권한을 거부하셨습니다. 삼성 인터넷 브라우저에서 위치 정보 접근 권한 초기화 기능을 제공하지 않기 때문에 크롬 브라우저를 사용해주세요. 😭`;

export const CHROME_GEOLOCATION_ERROR_MESSAGE = `위치 정보 접근 권한을 거부하셨습니다. "크롬 브라우저 우측 상단 더보기 > 설정 > 사이트 설정 > 위치 > 차단 리스트에 있는 machimban.com 선택 > 권한 위치정보 엑세스 선택 후 허용 체크"를 통해 위치 정보 접근 권한을 설정해주세요.`;

export const KAKAO_NAVIGATION_BASE_URL = `https://map.kakao.com/link/to`;

export const LOADING_IMAGE_SOURCE = `data:image/png;base64,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`;

export const DEFAULT_IMAGE_SOURCE = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAPnUlEQVR4Xu2dy5LjuA5EW///o/1+7/uGNWFfSabIIxGCABCzmUWF0chMJFK0zarpz58//6Zp+vDv378Ppf9/AP9d+fpnX6CNYv9bXBp1anwknvKcWePlOSfT379//x0Zomjiv4i4cElYFb+2LKLpfBbP1EoQKXE1NjcZdik8pM5ZUbZcWaljpQ9NnYsJMqL4hPRoJo+G54q5nROEDAf5x0mdFOWas56UPqTOSElSTZAky/8w59Iqr2Rq8lWCEDKJaUidTBL/5qND1tLacp2XQXqb7H09MZWUOaXqtIR//NwTL9HwEJ2b+izPIHe8e5KiZJJYXo5vj1hNR01TdaZ7X2+ZrKs+TCWbTpOXXFqLpVVLkBSlPiq9y6D39Zr6EBNHwzM/Iu8ZpBds7+utiU/6ibZ5o+E5ZfLfv3/P38Ui/2kMvZU+CJnENKSOBq+kj8TzPn27CZJknX+8imbyaHjIsngtrWeCkBdJmYbUGVqUIF+cjJCMzQQhw0zMFYGskmlH+qr/kEtrmyBk2KVMQ+oMKUolQazpQ/rxvBznBCEgyTCTOp7Jqpk1k2TNThSdp70EIcMuZRpSJ5MkP3EncyI9t6sEkS5+duNq9qFJejSTR8NTmrtmglgb1hFE2WKM8riiuYyk5raYIFLFSZ1o4pMhiGbyaHiWczsnCBGVDLtmncii7GGLtkw84KkmiKYpPJC1/TZvr0l7X6+pD1l+0fDM/C4ThJCQotz/e52iLRPLeF4GsdKklT40l0W0zRsKTylBNIdDKpFCibL4JH2kt8otLse3RywrTVrpQ3NZRDN5CDy1BNEcjkyS82ebaMvEEp7iIf1hDCtNWulDc1mE2LzwMVGT11NL+NevX6ZuFJ4CUfj2a7QhI7xEWyYW8OwmiDVnWyBraTqNfqKZ3CWeZ4KQDWXNNKQfl6J03gfRMK/mvNyJp5kgZAhHIatkNg3xopncE55pmyCaw65pPk+iSPGiYV7NebkDz5wgmiBT/LpV82bimp87TLE6a+4liEfTEPNlkuTNRDInz/lfJYhHU9y9YbaG0+gnmskt45nPIMRRlkHs9TbS4wpZbhrmJX2QeSN1NPAUE4Q0JwVSqo4GWdZ4yaV1/ePiKkHIsKYo14vS4rh3GfS+nsyJ5jK5Ek81QTRBSpF+JVnSNwql+G0Z6vFzT7yYwrM8gxw5cJoCIfDb6aPhIebzZJq78LwesZKsskU88RLN5Cbw1BKEPPaYACH41epoeO7avNvHUdIHmTdSR3KpvR3SJYvvkURAWiTLAh7CSzST34rn58+fIvdBbgVxwX2QaHjIUsrl+K568W1eb+96jCh+JonSmfGZIGTIUhQlUW7+C1OZJP/XeTdBiBmkTKVZJ5r4RKdoj4uqeLYJIjWsqiA6b+CNOGRE52jL5AyeZoKQ4SFkW6tzhqyS6T3VyaV1/GtC016CSA19inJclFwm9anpXUpHXj8niJQZPNY5QlZNNk91cmnxpdVMEKmhT1G4KFuurJjPSh9SCUvwrBJEygwe6xCy0uS2TX6FPnOCSDmS1LkCxF5NjaGPhocsNw1eSR9k3kidGp5igpCiUs1ZqxNNfMJvNJNL4lklCCFTyjySIFq1NIa+1cPj5xp9SOlD6oyA52WQGtgU3/azNxlmsvyi6SyCZ3kGuePdExEQAjcKc8jy75OUlsjbI1Ymydqy0R4jMknKK3lX51qCEDJz847x+EV0jrZMHniKh3SJA2VEsrzcKCTDTJZfPv7++zD9+PFD5EZhipJJQkwnNSdadXYThICNtmEI6dGScUSdD83tM0HIcBAypeocAnHzDTzCSzQ8ROcIy6SZIET8UchaDnkE8UumHeldTLS0tglChl3KNKQOAqFwo1CKl2h4CC+el8mcIATkiMNMePEsfs2smST/sfN6F2vvLUwrG89KH8Q0uUwOfhgn+JsxpfR51lkliHTxsxtKsw8yzKSfTBL/piieyfbOINtEsbLBrfRBTEPMFw0P4cXTMikmCAFJxCd1PJE1Ih6iczSTr96tfCQIIYEMh2adyKLsYctlov8YV00QTVOk+PriSz9GR1xa87tYW2CehjWiKC1MnvQhS9YynpdBrDRppQ+px8VoeAgvLYPPny94+XC3lCCEBLIZNOuEEsXQDUlNnS2a5u0Ry0qTVvqQMnk0PISXEEurliCEBM0NQ/oJIYrhT5Y1+LW0TIqHdEvPiJbIkuAlGp7wS+v79++mbhRKJZLGpiPDkXh8/7aU3QTRFJ8MUbTNGw0PmReXS+uZIGRICQnW6rgUxcENSU2d71wmzQSxZoo7ySqZrbef3tdb04f042lpTdsE0dwMhEypfjyJQniJhofofMcymROENEdE06xzB1m1oeztp/f11vQh/Xgw+W6CaA47IVOqHw+ibHsc6for0VlzmawShDSnOcykH02yNMwVDQ+ZFw1eSR+leWsmCBnSs//4HjEaQ2JZlDO8RMND5k5jTooJQpqzZgoNsjR5iYaHzItFk88JQprXHA7NfiyK0uopzyRrhq5cJtUE8WiKK8mSvoFH+I2Ghyy/1oJ4/FyNl2WCkOaJqB7rmBJF4D5INDxk7q4wzesR64ri241LQEqZK/GULeKJFxMmLyWI1JB6rGNCFMH7INHwkCUruQRWh3TVZzuBxwhtsvYSkfQhtSwkxbeAh/Byq8m/ffvWvA+SouTjiuYSIKYh/UjM7VuCSDVnrY4EWZYSNhoeMi+3JMkzQbQcaWnIzIpy4X2QW4bsQjxXz+1ugpDhIc1ZqxNt80bDQ+ZF1eTbBCFDn6LkmYTMCRl2zTpn5raZINZASvVzhqySLazUsdKHlD6kjkaSTHsJQpydomSSkDkhw65Z58jczgmi2Zxnsmob6wjpV9ax0oemzlcmSTNBiHlSlEwSMieapiH9kLldJQgpag2kVD+ErCs31bZ2bz+9r5fiVbPOFfrMCSIFIkXJJPG4ZGtzW0wQjyDT5P7NKTV3kkmySpAcsjq1tU0jKUqrlkZSt3p4/FyjDynTkDolPC+DjCT+WbK23371NETRhpkscxF9lmeQPChOhNPq5iQFPA1rNDxHl+PbI1YmyXokPA3zUfHvvPFJEoDgIXW6TF5LEPKPExDRhozw0iWK4I1Cos+IeAgvj7ktHtJbB7Bo4lOyvNzAGxHPZSb/+vVr80Yh+cdTlPJfUoq2TKLhac3tboIQU4xGVitZW2Qv+bLy2GmlDzJvUvwemttngkj946ROilKWyBMvh4bs5huFPeZrJggpPgpZFhOA6JNLq+Pxd5sghMwUpb4SRnqrPPpynBNEyhTRySrh8/RYRHSOhocs89rcTnsJQsgk/zipk6LkmYTMidS8HamzShCpJjNJOp55KwdaKX1InVxa/01xM0EImUccWY0zI8MhhYfUibZMouEpJoiUKaKRRXiJtnmj4Tm6tOYEIS8iwyFVZ3RR9haLJ16iLMdqgkiZIgpZR+6DeBpmonM0PGSZv84g2wG2QoaVPgiZZMhInWjLxDue1yOWxjB6J+vM/QkNXqXMSepEw9NcWsszSCZJ/41CMmRNUZT+uBDpY3Q8q0P6/Myl8FZrJkl+TqJpzi6T1xLEGggN83aRWVguvcug9/WJp7yMKC9vCaJpimjiE9KjmTwanrf5//Lli9qNQinzhRflgiQi5pXSh9Txshx3E4SAlCLdC1nLPntN2vt6TX2IztHwvPh9JgghIUWpW1ljSKItE+t4mgmiaQrrZJX66zVF7+s19SFLNByebYIQElKUTJIjX7sh82J1Oc4JYs0UVsmq9dW7OXtfT4ZQU+coeKa9BNEkU0rcKKJsjZh33NeMaOq8ShBrpsgkyU/cpZbn2TrNBLFmGtKP5oaxYmIrfRB9yLBawVNMECmQUnWskCWFh9SJZnKveOYEIY4molqr41WU1kLIM4nemaSaINZM0Rqcx8+jmSLxlFVX42WZINYSQKofNTIN3eOItkzuwvN6xPI0RHeRdeZGYZr85gToXVqlBJES1VodT0tA6vE22jLRxrM6pHt7htcmay9BpIaZ1IlmcvN4agliLQGk+jEvygX3QaItEy08bwkiNYSadbTIspSw0UxuFs/nz5/d3SiUMp9ZUS78i0zRlsnVeHYTRGoINetcTdayvhVzWelDSmdzeJ4JQg6IUiRYq2NOlPzVS8Vdd8c3CJoJYm2YST+ZJPktYDInJBSmbYKQF0n949bqZJI4/1Cv90PBRXK/ZvPxNm9UU2SSZJL0LuHdBIlqGoIrkyST5Dkn8xlE+gI+GcJeZ28lvOMAVxojK+ay0oeUznfhmROEgMjHFf+PKyPq3Du3xQSxlgBS/fSSJdWHZp27Nu8e17399L6eLImlPqsEIS/OIcskIXOiuQRIP2fntpog1kBK9XOWLM9nNe3N2+K4t5/e1xNTzXovzyB58K3/hSk1US54P782sCO9wdEy7uPnSz5eBknx/b+1SRI2ms6X46klCImho46889oqwTPikBFeoulM8bw9Yl3uyMLH+WfjnwzziOITXqLpfBmeT58+idwHoY60cG2VmGbEISO8RNO5hWf3kH6ZIy+4TkqGeUTxCS/RdBbH80wQQmYO2RgH+RF13v1gs3VIF3fkhddJ0+Tn/+RxNJ3F8GwTJIcsh2zkz8PesD8ShJhCzJEK10kJnhEfIwgv0XTuxTPtJQghkwwZqdMLQqoPqTrR8BBeWu8GbT+htv552AvzMkFGHOYRxR9R57NLq5kghMwcsnx3S2pOrNWZPwc5E3dnHXnkAGiNrGiPEYTfaDofxTMnCEkAQqZUnaMgdt/DNvKGQDQ8ROcoy6SaIMQUKf4Yj1fRdKZ4VglCNgMxjVQdCqK1razUsdKHlD6kTksb6+9uvQzSK17v6wnZmuYk/XgXP8+e4G9aLs8gVg/Q0cwXDU/kZfL2iNUrXu/rCdmZJOe/DiPFbzSdd/HUEkSKTKk6w4hi8FKZ1FLy9lhaPKRLHJyiDTMxuTfxU+d3xd7m9uPHjyI3CqU2DKkTzXzR8ERaJrsJQkCOOMyEl0wS/79c77W0nglChp0Mh2adaJs3Gh4yL9aXSTNBCEhiihQ/P3EncyI1b1J1pm2CuARh5DtXYqIEw0N4sZokc4JomiKTJJNEc96IOWv97CaIJxC9JOQ3COq/k1iTX2tJskoQTVNkkmSSaM7bWZM3E8QDCKsJcFaU6HgIL1aSpJggmqbIJMkk0Zw3Ys5lP3OCHH1Ry91Wht5KH1L8RsNDeGnN2uPnV/JSTRBNZ18Jcnvv4W7SNXklQ6jZjzudlwlijUypftyJ0vgLU9HwEJ3vWmqvRywrpFvpg4gmtXnvEv/MjUIpXrzo/D/AyGZWsiENSwAAAABJRU5ErkJggg==`;