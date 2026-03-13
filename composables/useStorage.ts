// composables/useStorage.ts
export const useStorage = () => {
  const supabase = useSupabaseClient()
  const config = useRuntimeConfig()

  const uploadFile = async (
    bucket: 'recipe-media' | 'collection-covers' | 'class-covers' | 'step-photos' | 'product-images' | 'theme-covers' | 'site-content',
    file: File,
    path: string
  ): Promise<{ url: string | null; error: Error | null }> => {
    const ext = file.name.split('.').pop()
    const fileName = `${path}/${Date.now()}.${ext}`

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { upsert: true })

    if (error) return { url: null, error }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
    return { url: data.publicUrl, error: null }
  }

  const deleteFile = async (bucket: string, path: string) => {
    const { error } = await supabase.storage.from(bucket).remove([path])
    return { error }
  }

  const getPublicUrl = (bucket: string, path: string) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  return { uploadFile, deleteFile, getPublicUrl }
}
