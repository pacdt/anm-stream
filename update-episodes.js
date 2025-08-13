const fs = require('fs');
const path = require('path');

// Diretório dos episódios
const episodesDir = path.join(__dirname, 'src', 'static-api', 'episodes');

// Função para gerar dados de streaming mock
function generateStreamingData(episodeNumber, animeId) {
  return {
    video_url: `https://example.com/stream/anime-${animeId}/episode-${episodeNumber}.mp4`,
    qualities: [
      {
        quality: '1080p',
        url: `https://example.com/stream/anime-${animeId}/episode-${episodeNumber}-1080p.mp4`,
        type: 'mp4'
      },
      {
        quality: '720p',
        url: `https://example.com/stream/anime-${animeId}/episode-${episodeNumber}-720p.mp4`,
        type: 'mp4'
      },
      {
        quality: '480p',
        url: `https://example.com/stream/anime-${animeId}/episode-${episodeNumber}-480p.mp4`,
        type: 'mp4'
      }
    ]
  };
}

// Função para atualizar um arquivo de episódio
function updateEpisodeFile(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Verificar se já tem dados de streaming
    if (data.episodes && data.episodes.length > 0 && data.episodes[0].streaming) {
      console.log(`✅ Arquivo ${path.basename(filePath)} já tem dados de streaming`);
      return;
    }
    
    // Adicionar dados de streaming para cada episódio
    if (data.episodes) {
      data.episodes = data.episodes.map(episode => ({
        ...episode,
        streaming: generateStreamingData(episode.episode_number, episode.anime_id)
      }));
      
      // Salvar arquivo atualizado
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ Atualizado: ${path.basename(filePath)} (${data.episodes.length} episódios)`);
    }
  } catch (error) {
    console.error(`❌ Erro ao processar ${path.basename(filePath)}:`, error.message);
  }
}

// Função principal
function updateAllEpisodes() {
  console.log('🚀 Iniciando atualização dos arquivos de episódios...');
  
  const files = fs.readdirSync(episodesDir)
    .filter(file => file.endsWith('.json'))
    .sort((a, b) => {
      const numA = parseInt(a.replace('.json', ''));
      const numB = parseInt(b.replace('.json', ''));
      return numA - numB;
    });
  
  console.log(`📁 Encontrados ${files.length} arquivos de episódios`);
  
  let updated = 0;
  let skipped = 0;
  
  files.forEach((file, index) => {
    const filePath = path.join(episodesDir, file);
    
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Verificar se já tem dados de streaming
      if (data.episodes && data.episodes.length > 0 && data.episodes[0].streaming) {
        skipped++;
        return;
      }
      
      updateEpisodeFile(filePath);
      updated++;
      
      // Log de progresso a cada 50 arquivos
      if ((index + 1) % 50 === 0) {
        console.log(`📊 Progresso: ${index + 1}/${files.length} arquivos processados`);
      }
    } catch (error) {
      console.error(`❌ Erro ao processar ${file}:`, error.message);
    }
  });
  
  console.log('\n🎉 Atualização concluída!');
  console.log(`✅ Arquivos atualizados: ${updated}`);
  console.log(`⏭️ Arquivos já atualizados: ${skipped}`);
  console.log(`📁 Total de arquivos: ${files.length}`);
}

// Executar atualização
updateAllEpisodes();