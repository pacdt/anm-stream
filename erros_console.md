✅ [STREAM DEBUG] Opções processadas: (3) [{…}, {…}, {…}]
Player.tsx:32 🎬 Player Debug Info:
Player.tsx:33   - Anime Query: {loading: false, error: null, data: true}
Player.tsx:34   - Episodes Query: {loading: false, error: null, data: undefined}
Player.tsx:35   - Stream Query: {loading: false, error: null, data: true}
Player.tsx:36   - Video Sources: 3 (3) [{…}, {…}, {…}]
Player.tsx:37   - Selected Source: {label: '360p', src: 'http://localhost:4000/api/video-proxy?url=https%3A…s6%2Fmp4%2Fsousou-no-frieren-dublado%2Fsd%2F1.mp4', isAlternative: false}
Player.tsx:38   - Current Episode: 1
Player.tsx:39   - Anime ID: 102
api.ts:134 🎬 [STREAM DEBUG] Dados recebidos da API externa: {
  "message": "Dados de streaming externos do episódio 1",
  "anime": {
    "id": 102,
    "nome": "Sousou no Frieren (Dublado)"
  },
  "episode": {
    "number": 1,
    "url": "https://animefire.plus/video/sousou-no-frieren-dublado/1"
  },
  "stream_data": [
    {
      "src": "https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/sd/1.mp4",
      "label": "360p"
    },
    {
      "src": "https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/hd/1.mp4",
      "label": "720p"
    },
    {
      "src": "https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4",
      "label": "1080p"
    }
  ],
  "token": null,
  "metadata": {
    "op_start": null,
    "op_end": null
  },
  "available_qualities": [
    "360p",
    "720p",
    "1080p"
  ]
}
api.ts:160 📺 [STREAM DEBUG] Stream data encontrado: 3 streams
api.ts:162 🎥 [STREAM DEBUG] Stream 1: {label: '360p', src: 'https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/sd/1.mp4...'}
api.ts:143 🔄 [PROXY DEBUG] URL original: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/sd/1.mp4...
api.ts:144 🔄 [PROXY DEBUG] URL do proxy: http://localhost:4000/api/video-proxy?url=https%3A%2F%2Flightspeedst.net%2Fs6%2Fmp4%2Fsousou-no-frieren-dublado%2Fsd%2F1.mp4
api.ts:162 🎥 [STREAM DEBUG] Stream 2: {label: '720p', src: 'https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/hd/1.mp4...'}
api.ts:143 🔄 [PROXY DEBUG] URL original: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/hd/1.mp4...
api.ts:144 🔄 [PROXY DEBUG] URL do proxy: http://localhost:4000/api/video-proxy?url=https%3A%2F%2Flightspeedst.net%2Fs6%2Fmp4%2Fsousou-no-frieren-dublado%2Fhd%2F1.mp4
api.ts:162 🎥 [STREAM DEBUG] Stream 3: {label: '1080p', src: 'https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4...'}
api.ts:143 🔄 [PROXY DEBUG] URL original: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4...
api.ts:144 🔄 [PROXY DEBUG] URL do proxy: http://localhost:4000/api/video-proxy?url=https%3A%2F%2Flightspeedst.net%2Fs6%2Fmp4%2Fsousou-no-frieren-dublado%2Ffhd%2F1.mp4
api.ts:197 ✅ [STREAM DEBUG] Opções processadas: (3) [{…}, {…}, {…}]
Player.tsx:32 🎬 Player Debug Info:
Player.tsx:33   - Anime Query: {loading: false, error: null, data: true}
Player.tsx:34   - Episodes Query: {loading: false, error: null, data: undefined}
Player.tsx:35   - Stream Query: {loading: false, error: null, data: true}
Player.tsx:36   - Video Sources: 3 (3) [{…}, {…}, {…}]
Player.tsx:37   - Selected Source: {label: '360p', src: 'http://localhost:4000/api/video-proxy?url=https%3A…s6%2Fmp4%2Fsousou-no-frieren-dublado%2Fsd%2F1.mp4', isAlternative: false}isAlternative: falselabel: "360p"src: "http://localhost:4000/api/video-proxy?url=https%3A%2F%2Flightspeedst.net%2Fs6%2Fmp4%2Fsousou-no-frieren-dublado%2Fsd%2F1.mp4"[[Prototype]]: Object
Player.tsx:38   - Current Episode: 1
Player.tsx:39   - Anime ID: 102
useAuth.ts:31 Rodando em modo visitante - Supabase não configurado
VideoPlayer.tsx:91 VideoPlayer - Available sources received: (3) [{…}, {…}, {…}]0: {label: '360p', src: 'http://localhost:4000/api/video-proxy?url=https%3A…s6%2Fmp4%2Fsousou-no-frieren-dublado%2Fsd%2F1.mp4', isAlternative: false}1: {label: '720p', src: 'http://localhost:4000/api/video-proxy?url=https%3A…s6%2Fmp4%2Fsousou-no-frieren-dublado%2Fhd%2F1.mp4', isAlternative: false}2: isAlternative: falselabel: "1080p"src: "http://localhost:4000/api/video-proxy?url=https%3A%2F%2Flightspeedst.net%2Fs6%2Fmp4%2Fsousou-no-frieren-dublado%2Ffhd%2F1.mp4"[[Prototype]]: Objectlength: 3[[Prototype]]: Array(0)
VideoPlayer.tsx:92 VideoPlayer - Available sources length: 3
VideoPlayer.tsx:93 VideoPlayer - Current source: {label: '360p', src: 'http://localhost:4000/api/video-proxy?url=https%3A…s6%2Fmp4%2Fsousou-no-frieren-dublado%2Fsd%2F1.mp4', isAlternative: false}
VideoPlayer.tsx:94 VideoPlayer - Current source URL: http://localhost:4000/api/video-proxy?url=https%3A%2F%2Flightspeedst.net%2Fs6%2Fmp4%2Fsousou-no-frieren-dublado%2Fsd%2F1.mp4
VideoPlayer.tsx:95 VideoPlayer - URL type check: string
VideoPlayer.tsx:96 VideoPlayer - URL validity check: true
useAuth.ts:31 Rodando em modo visitante - Supabase não configurado
VideoPlayer.tsx:91 VideoPlayer - Available sources received: (3) [{…}, {…}, {…}]
VideoPlayer.tsx:92 VideoPlayer - Available sources length: 3
VideoPlayer.tsx:93 VideoPlayer - Current source: {label: '360p', src: 'http://localhost:4000/api/video-proxy?url=https%3A…s6%2Fmp4%2Fsousou-no-frieren-dublado%2Fsd%2F1.mp4', isAlternative: false}
VideoPlayer.tsx:94 VideoPlayer - Current source URL: http://localhost:4000/api/video-proxy?url=https%3A%2F%2Flightspeedst.net%2Fs6%2Fmp4%2Fsousou-no-frieren-dublado%2Fsd%2F1.mp4
VideoPlayer.tsx:95 VideoPlayer - URL type check: string
VideoPlayer.tsx:96 VideoPlayer - URL validity check: true
VideoPlayer.tsx:105 VideoPlayer - Load start for URL: http://localhost:4000/api/video-proxy?url=https%3A%2F%2Flightspeedst.net%2Fs6%2Fmp4%2Fsousou-no-frieren-dublado%2Fsd%2F1.mp4
VideoPlayer.tsx:106 VideoPlayer - Current source object: {label: '360p', src: 'http://localhost:4000/api/video-proxy?url=https%3A…s6%2Fmp4%2Fsousou-no-frieren-dublado%2Fsd%2F1.mp4', isAlternative: false}
VideoPlayer.tsx:117 VideoPlayer - Error occurred: MediaError {code: 4, message: 'MEDIA_ELEMENT_ERROR: Format error'}
VideoPlayer.tsx:118 VideoPlayer - Current video src: http://localhost:4000/api/video-proxy?url=https%3A%2F%2Flightspeedst.net%2Fs6%2Fmp4%2Fsousou-no-frieren-dublado%2Fsd%2F1.mp4
VideoPlayer.tsx:119 VideoPlayer - Video readyState: 0
VideoPlayer.tsx:120 VideoPlayer - Video networkState: 3
VideoPlayer.tsx:123 VideoPlayer - Error code: 4
VideoPlayer.tsx:124 VideoPlayer - Error message: MEDIA_ELEMENT_ERROR: Format error
VideoPlayer.tsx:143 VideoPlayer - Error: MEDIA_ERR_SRC_NOT_SUPPORTED
VideoPlayer.tsx:144 VideoPlayer - Unsupported source URL: http://localhost:4000/api/video-proxy?url=https%3A%2F%2Flightspeedst.net%2Fs6%2Fmp4%2Fsousou-no-frieren-dublado%2Fsd%2F1.mp4