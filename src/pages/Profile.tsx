import React, { useState } from 'react'
import { User, Edit3, Save, X, Camera, Mail, Calendar, MapPin } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useUserProfile, useUpdateProfile } from '@/hooks/useUser'
import { toast } from 'sonner'

interface ProfileFormData {
  displayName: string
  bio: string
  location: string
  birthDate: string
  favoriteGenres: string[]
}

export const Profile: React.FC = () => {
  const { user } = useAuth()
  const { data: profile, isLoading } = useUserProfile(user?.id || '')
  const updateProfileMutation = useUpdateProfile()
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: '',
    bio: '',
    location: '',
    birthDate: '',
    favoriteGenres: []
  })

  React.useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        location: profile.location || '',
        birthDate: profile.birthDate || '',
        favoriteGenres: profile.favoriteGenres || []
      })
    }
  }, [profile])

  const handleSave = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        userId: user!.id,
        ...formData
      })
      setIsEditing(false)
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar perfil')
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        location: profile.location || '',
        birthDate: profile.birthDate || '',
        favoriteGenres: profile.favoriteGenres || []
      })
    }
    setIsEditing(false)
  }

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.includes(genre)
        ? prev.favoriteGenres.filter(g => g !== genre)
        : [...prev.favoriteGenres, genre]
    }))
  }

  const availableGenres = [
    'action', 'adventure', 'comedy', 'drama', 'fantasy',
    'romance', 'sci-fi', 'thriller', 'horror', 'mystery'
  ]

  const genreLabels: Record<string, string> = {
    action: 'Ação',
    adventure: 'Aventura',
    comedy: 'Comédia',
    drama: 'Drama',
    fantasy: 'Fantasia',
    romance: 'Romance',
    'sci-fi': 'Ficção Científica',
    thriller: 'Thriller',
    horror: 'Terror',
    mystery: 'Mistério'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-3xl font-bold">Meu Perfil</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={updateProfileMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  Salvar
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
              </div>
            )}
          </div>

          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Display Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome de Exibição
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Seu nome"
                    />
                  ) : (
                    <p className="text-white">{profile?.displayName || 'Não informado'}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-400">{user?.email}</p>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Localização
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Sua cidade/país"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="text-white">{profile?.location || 'Não informado'}</p>
                    </div>
                  )}
                </div>

                {/* Birth Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Data de Nascimento
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-white">
                        {profile?.birthDate
                          ? new Date(profile.birthDate).toLocaleDateString('pt-BR')
                          : 'Não informado'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Biografia
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    placeholder="Conte um pouco sobre você..."
                  />
                ) : (
                  <p className="text-white">{profile?.bio || 'Nenhuma biografia adicionada'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Favorite Genres */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Gêneros Favoritos</h2>
          <div className="flex flex-wrap gap-2">
            {availableGenres.map((genre) => (
              <button
                key={genre}
                onClick={() => isEditing && handleGenreToggle(genre)}
                disabled={!isEditing}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  formData.favoriteGenres.includes(genre)
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {genreLabels[genre]}
              </button>
            ))}
          </div>
          {formData.favoriteGenres.length === 0 && (
            <p className="text-gray-400 mt-2">Nenhum gênero selecionado</p>
          )}
        </div>

        {/* Statistics */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Estatísticas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">
                {profile?.stats?.totalWatched || 0}
              </div>
              <div className="text-sm text-gray-400">Animes Assistidos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {profile?.stats?.totalEpisodes || 0}
              </div>
              <div className="text-sm text-gray-400">Episódios</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {profile?.stats?.totalHours || 0}h
              </div>
              <div className="text-sm text-gray-400">Horas Assistidas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {profile?.stats?.totalFavorites || 0}
              </div>
              <div className="text-sm text-gray-400">Favoritos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}