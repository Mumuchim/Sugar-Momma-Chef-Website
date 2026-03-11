<template>
  <div>
    <PageHero
      label="Exclusive"
      title="Premium Collections"
      subtitle="Themed recipe sets, fully unlocked for a one-time payment."
    />

    <section class="py-20 container mx-auto px-6 lg:px-16 max-w-7xl">
      <div v-if="pending" class="grid md:grid-cols-2 gap-10">
        <CollectionCardSkeleton v-for="i in 4" :key="i" />
      </div>

      <div v-else class="grid md:grid-cols-2 gap-10">
        <CollectionCard
          v-for="collection in collections"
          :key="collection.id"
          :collection="collection"
          :has-access="accessMap[collection.id] || false"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { fetchAllCollections, checkUserAccess } = useCollections()
const user = useSupabaseUser()

const collections = ref<any[]>([])
const accessMap = ref<Record<string, boolean>>({})
const pending = ref(true)

onMounted(async () => {
  const { data } = await fetchAllCollections()
  collections.value = data || []

  if (user.value) {
    for (const col of collections.value) {
      accessMap.value[col.id] = await checkUserAccess(col.id)
    }
  }

  pending.value = false
})

useSeoMeta({
  title: 'Premium Collections — Sugar Momma',
  description: 'Unlock exclusive themed pastry recipe collections curated by our Head Executive Chef.',
})
</script>
