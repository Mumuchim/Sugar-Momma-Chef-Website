<template>
  <div>
    <!-- Tab bar -->
    <div class="flex gap-1 mb-8 border-b border-charcoal-700 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="font-sans text-sm px-5 py-3 whitespace-nowrap transition-colors duration-200 border-b-2 -mb-px"
        :class="activeTab === tab.id
          ? 'text-gold border-gold'
          : 'text-cream-200/40 border-transparent hover:text-cream-200/80'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- ── HOME HERO ──────────────────────────────── -->
    <section v-if="activeTab === 'home_hero'" class="max-w-2xl space-y-6">
      <div>
        <h2 class="font-serif text-cream-100 text-2xl mb-1">Home — Hero Section</h2>
        <p class="font-sans text-cream-200/40 text-sm">The large full-screen banner at the top of the homepage.</p>
      </div>

      <div class="bg-charcoal-800 border border-charcoal-700 p-6 space-y-5">
        <div>
          <label class="field-label">Title Line 1</label>
          <input v-model="hero.title_line1" class="field-input" placeholder="Where Japanese" />
        </div>
        <div>
          <label class="field-label">Title Line 2</label>
          <input v-model="hero.title_line2" class="field-input" placeholder="precision meets" />
        </div>
        <div>
          <label class="field-label">Title Highlight (shown in gold italic)</label>
          <input v-model="hero.title_highlight" class="field-input" placeholder="sweetness." />
        </div>
        <div>
          <label class="field-label">Subtitle / Description</label>
          <textarea v-model="hero.description" class="field-input min-h-[80px]" />
        </div>
        <button class="btn-gold text-sm" :disabled="saving === 'home_hero'" @click="save('home_hero', hero)">
          {{ saving === 'home_hero' ? 'Saving…' : 'Save Hero' }}
        </button>
        <p v-if="saved === 'home_hero'" class="font-sans text-xs text-emerald-400">✓ Saved!</p>
      </div>
    </section>

    <!-- ── HOME CHEF SECTION ─────────────────────────── -->
    <section v-if="activeTab === 'home_chef'" class="max-w-2xl space-y-6">
      <div>
        <h2 class="font-serif text-cream-100 text-2xl mb-1">Home — Chef Section</h2>
        <p class="font-sans text-cream-200/40 text-sm">The "Meet the Chef" portrait block on the homepage.</p>
      </div>

      <div class="bg-charcoal-800 border border-charcoal-700 p-6 space-y-5">
        <!-- Photo upload -->
        <div>
          <label class="field-label mb-3">Chef Photo</label>
          <div v-if="homeChef.photo_url" class="mb-3">
            <img :src="homeChef.photo_url" class="h-48 w-36 object-cover border border-charcoal-600" />
          </div>
          <AdminImageUpload
            label="Photo"
            :currentUrl="homeChef.photo_url"
            bucket="site-content"
            path="home/chef-portrait"
            @uploaded="(url) => homeChef.photo_url = url"
          />
        </div>

        <div>
          <label class="field-label">Chef Name (shown in badge overlay)</label>
          <input v-model="homeChef.name" class="field-input" placeholder="Chef Regina Faustino" />
        </div>
        <div>
          <label class="field-label">Badge Role (small gold text under name)</label>
          <input v-model="homeChef.badge_role" class="field-input" placeholder="Executive Head Chef" />
        </div>

        <hr class="border-charcoal-700" />

        <div>
          <label class="field-label">Section Label (small uppercase tag)</label>
          <input v-model="homeChef.section_label" class="field-input" placeholder="The Woman Behind Sugar Momma" />
        </div>
        <div>
          <label class="field-label">Heading</label>
          <input v-model="homeChef.heading" class="field-input" placeholder="Crafted with" />
        </div>
        <div>
          <label class="field-label">Heading Highlight (shown in gold italic)</label>
          <input v-model="homeChef.heading_highlight" class="field-input" placeholder="passion & precision." />
        </div>
        <div>
          <label class="field-label">Bio Paragraph 1</label>
          <textarea v-model="homeChef.bio_para1" class="field-input min-h-[90px]" />
        </div>
        <div>
          <label class="field-label">Bio Paragraph 2</label>
          <textarea v-model="homeChef.bio_para2" class="field-input min-h-[80px]" />
        </div>

        <button class="btn-gold text-sm" :disabled="saving === 'home_chef'" @click="save('home_chef', homeChef)">
          {{ saving === 'home_chef' ? 'Saving…' : 'Save Chef Section' }}
        </button>
        <p v-if="saved === 'home_chef'" class="font-sans text-xs text-emerald-400">✓ Saved!</p>
      </div>
    </section>

    <!-- ── HOME SHOP TEASER ──────────────────────────── -->    <section v-if="activeTab === 'home_shop'" class="max-w-2xl space-y-6">
      <div>
        <h2 class="font-serif text-cream-100 text-2xl mb-1">Home — Shop Teaser Section</h2>
        <p class="font-sans text-cream-200/40 text-sm">The "Order Online / Fresh Baked Goods" section on the homepage.</p>
      </div>

      <div class="bg-charcoal-800 border border-charcoal-700 p-6 space-y-5">
        <div>
          <label class="field-label">Label (small uppercase text above title)</label>
          <input v-model="shopTeaser.label" class="field-input" placeholder="Order Online" />
        </div>
        <div>
          <label class="field-label">Title Line 1</label>
          <input v-model="shopTeaser.title" class="field-input" placeholder="Fresh Baked" />
        </div>
        <div>
          <label class="field-label">Title Line 2</label>
          <input v-model="shopTeaser.title_line2" class="field-input" placeholder="Goods" />
        </div>
        <div>
          <label class="field-label">Description</label>
          <textarea v-model="shopTeaser.description" class="field-input min-h-[100px]"
            placeholder="Artisan pastries made to order…" />
        </div>
        <button class="btn-gold text-sm" :disabled="saving === 'home_shop_teaser'" @click="save('home_shop_teaser', shopTeaser)">
          {{ saving === 'home_shop_teaser' ? 'Saving…' : 'Save Shop Teaser' }}
        </button>
        <p v-if="saved === 'home_shop_teaser'" class="font-sans text-xs text-emerald-400">✓ Saved!</p>
      </div>
    </section>

    <!-- ── ABOUT CHEF ──────────────────────────────── -->
    <section v-if="activeTab === 'about_chef'" class="max-w-2xl space-y-6">
      <div>
        <h2 class="font-serif text-cream-100 text-2xl mb-1">About — Chef Profile</h2>
        <p class="font-sans text-cream-200/40 text-sm">Name, role, portrait photo, bio paragraphs, and philosophy quote.</p>
      </div>

      <div class="bg-charcoal-800 border border-charcoal-700 p-6 space-y-5">
        <!-- Portrait -->
        <div>
          <label class="field-label mb-3">Chef Portrait Photo</label>
          <div v-if="chef.portrait_url" class="mb-3">
            <img :src="chef.portrait_url" class="h-40 w-32 object-cover border border-charcoal-600" />
          </div>
          <AdminImageUpload
            label="Portrait"
            :currentUrl="chef.portrait_url"
            bucket="site-content"
            path="about/chef-portrait"
            @uploaded="(url) => chef.portrait_url = url"
          />
        </div>

        <div>
          <label class="field-label">Chef Name</label>
          <input v-model="chef.name" class="field-input" placeholder="Chef Regina Faustino" />
        </div>
        <div>
          <label class="field-label">Role / Title</label>
          <input v-model="chef.role" class="field-input" placeholder="Founder & Head Chef, Sugar Momma" />
        </div>

        <!-- Bio paragraphs -->
        <div>
          <label class="field-label mb-3">Bio Paragraphs</label>
          <div class="space-y-3">
            <div v-for="(para, i) in chef.bio" :key="i" class="flex gap-2 items-start">
              <textarea
                v-model="chef.bio[i]"
                class="field-input min-h-[80px] flex-1"
                :placeholder="`Paragraph ${i + 1}`"
              />
              <button
                type="button"
                class="text-red-400/50 hover:text-red-400 font-sans text-xs mt-2 shrink-0"
                @click="chef.bio.splice(i, 1)"
              >✕</button>
            </div>
          </div>
          <button
            type="button"
            class="mt-3 font-sans text-xs text-gold/60 hover:text-gold border border-dashed border-charcoal-600 hover:border-gold/40 px-4 py-2 transition-colors"
            @click="chef.bio.push('')"
          >+ Add Paragraph</button>
        </div>

        <div>
          <label class="field-label">Philosophy Quote</label>
          <textarea v-model="chef.philosophy_quote" class="field-input min-h-[80px]"
            placeholder="A perfect pastry should taste like…" />
        </div>

        <button class="btn-gold text-sm" :disabled="saving === 'about_chef'" @click="save('about_chef', chef)">
          {{ saving === 'about_chef' ? 'Saving…' : 'Save Chef Profile' }}
        </button>
        <p v-if="saved === 'about_chef'" class="font-sans text-xs text-emerald-400">✓ Saved!</p>
      </div>
    </section>

    <!-- ── ABOUT TIMELINE ──────────────────────────── -->
    <section v-if="activeTab === 'about_timeline'" class="max-w-2xl space-y-6">
      <div>
        <h2 class="font-serif text-cream-100 text-2xl mb-1">About — Career Timeline</h2>
        <p class="font-sans text-cream-200/40 text-sm">The career highlights shown on the about page.</p>
      </div>

      <div class="bg-charcoal-800 border border-charcoal-700 p-6 space-y-4">
        <div
          v-for="(item, i) in timeline"
          :key="i"
          class="border border-charcoal-700 p-4 space-y-3"
        >
          <div class="flex items-center justify-between">
            <span class="font-sans text-xs text-cream-200/40 uppercase tracking-widest">Entry {{ i + 1 }}</span>
            <button class="text-red-400/50 hover:text-red-400 font-sans text-xs" @click="timeline.splice(i, 1)">Remove</button>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="field-label">Year</label>
              <input v-model="item.year" class="field-input" placeholder="2009" />
            </div>
            <div class="col-span-2">
              <label class="field-label">Title</label>
              <input v-model="item.title" class="field-input" placeholder="Le Cordon Bleu, Paris" />
            </div>
          </div>
          <div>
            <label class="field-label">Detail</label>
            <input v-model="item.detail" class="field-input" placeholder="Graduated with Pâtisserie Grand Diplôme" />
          </div>
        </div>

        <button
          type="button"
          class="w-full font-sans text-xs text-gold/60 hover:text-gold border border-dashed border-charcoal-600 hover:border-gold/40 px-4 py-3 transition-colors"
          @click="timeline.push({ year: '', title: '', detail: '' })"
        >+ Add Timeline Entry</button>

        <button class="btn-gold text-sm" :disabled="saving === 'about_timeline'" @click="save('about_timeline', timeline)">
          {{ saving === 'about_timeline' ? 'Saving…' : 'Save Timeline' }}
        </button>
        <p v-if="saved === 'about_timeline'" class="font-sans text-xs text-emerald-400">✓ Saved!</p>
      </div>
    </section>

    <!-- ── ABOUT PRESS & SOCIALS ──────────────────── -->
    <section v-if="activeTab === 'about_press'" class="max-w-2xl space-y-6">
      <div>
        <h2 class="font-serif text-cream-100 text-2xl mb-1">About — Press & Socials</h2>
        <p class="font-sans text-cream-200/40 text-sm">Publications listed in "As Seen In" and social media links.</p>
      </div>

      <!-- Press -->
      <div class="bg-charcoal-800 border border-charcoal-700 p-6 space-y-4">
        <p class="font-sans text-xs text-cream-200/60 uppercase tracking-widest">Press Features ("As Seen In")</p>
        <div v-for="(pub, i) in press" :key="i" class="flex gap-2 items-center">
          <input v-model="press[i]" class="field-input flex-1" placeholder="Manila Bulletin" />
          <button class="text-red-400/50 hover:text-red-400 font-sans text-xs shrink-0" @click="press.splice(i, 1)">✕</button>
        </div>
        <button
          type="button"
          class="font-sans text-xs text-gold/60 hover:text-gold border border-dashed border-charcoal-600 hover:border-gold/40 px-4 py-2 transition-colors"
          @click="press.push('')"
        >+ Add Publication</button>
        <button class="btn-gold text-sm" :disabled="saving === 'about_press'" @click="save('about_press', press)">
          {{ saving === 'about_press' ? 'Saving…' : 'Save Press' }}
        </button>
        <p v-if="saved === 'about_press'" class="font-sans text-xs text-emerald-400">✓ Saved!</p>
      </div>

      <!-- Socials -->
      <div class="bg-charcoal-800 border border-charcoal-700 p-6 space-y-4">
        <p class="font-sans text-xs text-cream-200/60 uppercase tracking-widest">Social Media Links</p>
        <div v-for="(social, i) in socials" :key="i" class="grid grid-cols-2 gap-3 items-center">
          <input v-model="social.label" class="field-input" placeholder="Instagram" />
          <div class="flex gap-2">
            <input v-model="social.href" class="field-input flex-1" placeholder="https://instagram.com/sugarmomma" />
            <button class="text-red-400/50 hover:text-red-400 font-sans text-xs shrink-0" @click="socials.splice(i, 1)">✕</button>
          </div>
        </div>
        <button
          type="button"
          class="font-sans text-xs text-gold/60 hover:text-gold border border-dashed border-charcoal-600 hover:border-gold/40 px-4 py-2 transition-colors"
          @click="socials.push({ label: '', href: '' })"
        >+ Add Social</button>
        <button class="btn-gold text-sm" :disabled="saving === 'about_socials'" @click="save('about_socials', socials)">
          {{ saving === 'about_socials' ? 'Saving…' : 'Save Socials' }}
        </button>
        <p v-if="saved === 'about_socials'" class="font-sans text-xs text-emerald-400">✓ Saved!</p>
      </div>
    </section>
    <!-- ── CLASSES HERO ──────────────────────────────── -->
    <section v-if="activeTab === 'classes_hero'" class="max-w-2xl space-y-6">
      <div>
        <h2 class="font-serif text-cream-100 text-2xl mb-1">Classes — Hero Banner</h2>
        <p class="font-sans text-cream-200/40 text-sm">The top banner shown on the /classes page.</p>
      </div>

      <div class="bg-charcoal-800 border border-charcoal-700 p-6 space-y-5">
        <div>
          <label class="field-label">Label (small uppercase tag above title)</label>
          <input v-model="classesHero.label" class="field-input" placeholder="Learn the Craft" />
        </div>
        <div>
          <label class="field-label">Title</label>
          <input v-model="classesHero.title" class="field-input" placeholder="Cooking Classes" />
        </div>
        <div>
          <label class="field-label">Subtitle</label>
          <input v-model="classesHero.subtitle" class="field-input" placeholder="Small group sessions where technique meets creativity." />
        </div>
        <button class="btn-gold text-sm" :disabled="saving === 'classes_hero'" @click="save('classes_hero', classesHero)">
          {{ saving === 'classes_hero' ? 'Saving…' : 'Save Hero' }}
        </button>
        <p v-if="saved === 'classes_hero'" class="font-sans text-xs text-emerald-400">✓ Saved!</p>
      </div>
    </section>

    <!-- ── CLASSES INSTRUCTOR ─────────────────────────── -->
    <section v-if="activeTab === 'classes_instructor'" class="max-w-2xl space-y-6">
      <div>
        <h2 class="font-serif text-cream-100 text-2xl mb-1">Classes — Instructor Section</h2>
        <p class="font-sans text-cream-200/40 text-sm">The "Your Instructor" bio block shown on the /classes page.</p>
      </div>

      <div class="bg-charcoal-800 border border-charcoal-700 p-6 space-y-5">
        <!-- Photo -->
        <div>
          <label class="field-label mb-3">Instructor Photo</label>
          <div v-if="instructor.photo_url" class="mb-3">
            <img :src="instructor.photo_url" class="h-48 w-36 object-cover border border-charcoal-600" />
          </div>
          <AdminImageUpload
            label="Photo"
            :currentUrl="instructor.photo_url"
            bucket="site-content"
            path="classes/instructor"
            @uploaded="(url) => instructor.photo_url = url"
          />
        </div>

        <div>
          <label class="field-label">Instructor Name</label>
          <input v-model="instructor.name" class="field-input" placeholder="Chef Regina Faustino" />
        </div>

        <div>
          <label class="field-label">Bio Paragraph</label>
          <textarea
            v-model="instructor.bio"
            class="field-input min-h-[120px]"
            placeholder="With over 12 years in Japanese fine-dining kitchens…"
          />
        </div>

        <!-- Credentials -->
        <div>
          <label class="field-label mb-3">Credential Badges</label>
          <p class="font-sans text-xs text-cream-200/30 mb-3">Shown as small cards below the bio.</p>
          <div class="space-y-2">
            <div v-for="(cred, i) in instructor.credentials" :key="i" class="flex gap-2 items-center">
              <input
                v-model="instructor.credentials[i]"
                class="field-input flex-1"
                placeholder="Le Cordon Bleu, Paris — Pâtisserie Diploma"
              />
              <button
                type="button"
                class="text-red-400/50 hover:text-red-400 font-sans text-xs shrink-0"
                @click="instructor.credentials.splice(i, 1)"
              >✕</button>
            </div>
          </div>
          <button
            type="button"
            class="mt-3 font-sans text-xs text-gold/60 hover:text-gold border border-dashed border-charcoal-600 hover:border-gold/40 px-4 py-2 transition-colors"
            @click="instructor.credentials.push('')"
          >+ Add Credential</button>
        </div>

        <button class="btn-gold text-sm" :disabled="saving === 'classes_instructor'" @click="save('classes_instructor', instructor)">
          {{ saving === 'classes_instructor' ? 'Saving…' : 'Save Instructor' }}
        </button>
        <p v-if="saved === 'classes_instructor'" class="font-sans text-xs text-emerald-400">✓ Saved!</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const activeTab = ref('home_hero')

const tabs = [
  { id: 'home_hero',         label: 'Home Hero' },
  { id: 'home_chef',         label: 'Home Chef Section' },
  { id: 'home_shop',         label: 'Home Shop Teaser' },
  { id: 'about_chef',        label: 'About — Chef' },
  { id: 'about_timeline',    label: 'About — Timeline' },
  { id: 'about_press',       label: 'About — Press & Socials' },
  { id: 'classes_hero',      label: 'Classes — Hero' },
  { id: 'classes_instructor',label: 'Classes — Instructor' },
]

const saving = ref<string | null>(null)
const saved  = ref<string | null>(null)

// ── State ─────────────────────────────────────────────

const hero = reactive({
  title_line1:    'Where Japanese',
  title_line2:    'precision meets',
  title_highlight:'sweetness.',
  description:    'Custom catering orders, fresh baked goods, and intimate cooking classes — crafted with the discipline of fine dining.',
})

const shopTeaser = reactive({
  label:       'Order Online',
  title:       'Fresh Baked',
  title_line2: 'Goods',
  description: 'Artisan pastries made to order — available per piece or in bundles. Choose pickup from Rizal or have them delivered to your door.',
})

const homeChef = reactive({
  photo_url:         '',
  name:              'Chef Regina Faustino',
  badge_role:        'Executive Head Chef',
  section_label:     'The Woman Behind Sugar Momma',
  heading:           'Crafted with',
  heading_highlight: 'passion & precision.',
  bio_para1:         "Sugar Momma was born from Chef Regina's dream of bringing the discipline of Japanese fine-dining pastry to every table in the Philippines. After over 12 years in Michelin-starred kitchens across Tokyo and Manila, she returned home to build something deeply personal — a place where technique and soul coexist.",
  bio_para2:         "Every recipe, every class, every custom creation carries her signature: meticulous, heartfelt, and unmistakably Sugar Momma.",
})

const chef = reactive({
  name:            'Chef Regina Faustino',
  role:            'Founder & Head Chef, Sugar Momma',
  portrait_url:    '',
  philosophy_quote:'A perfect pastry should taste like it came from someone who loves you. The technique is just the beginning.',
  bio: [
    'Chef Regina Faustino grew up watching her grandmother make kakanin in a small kitchen in Bulacan — measuring nothing, wasting nothing, pouring everything into each piece. That memory became the foundation of everything she would later learn to do with precision.',
    'After graduating from Le Cordon Bleu in Paris with a Pâtisserie Diploma, she spent three formative years in Tokyo at Nihonbashi Yukari, a restaurant renowned for bridging Japanese kaiseki tradition with French technique.',
    'Returning to Rizal as Executive Head Chef at ABCT Japanese Restaurant, she led the dessert program that earned the restaurant its first appearance in the Asia\'s 50 Best extended list.',
    'Sugar Momma was Regina\'s answer to a simpler question: what if the most exquisite pastry wasn\'t locked inside a fine-dining reservation?',
    'Today, Sugar Momma is more than a brand. It\'s a living archive of Regina\'s journey — recipes she developed in Tokyo, techniques she refined in Paris, and flavors that have always been Filipino at heart.',
  ] as string[],
})

const timeline = ref([
  { year: '2009', title: 'Le Cordon Bleu, Paris', detail: 'Graduated with Pâtisserie Grand Diplôme' },
  { year: '2010', title: 'Nihonbashi Yukari, Tokyo', detail: '3-year tenure under Chef Kimio Nonaga' },
  { year: '2013', title: "L'Atelier de Joël Robuchon, Hong Kong", detail: 'Stage program, dessert innovation' },
  { year: '2015', title: 'ABCT Japanese Restaurant', detail: 'Appointed Head Executive Head Chef' },
  { year: '2019', title: 'Manila Bulletin', detail: 'Named "Chef to Watch" — Class of 2019' },
  { year: '2021', title: 'Sugar Momma Founded', detail: 'Launched as an independent pastry brand' },
  { year: '2023', title: 'Manila Bulletin', detail: 'Featured in "The New Filipino Table" cover story' },
])

const press = ref(['Manila Bulletin', 'Metro Magazine', 'Lifestyle Asia', 'Manila Times', 'CNN Philippines'])

const socials = ref([
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Facebook',  href: 'https://facebook.com' },
  { label: 'YouTube',   href: 'https://youtube.com' },
])

const classesHero = reactive({
  label:    'Learn the Craft',
  title:    'Cooking Classes',
  subtitle: 'Small group sessions where technique meets creativity.',
})

const instructor = reactive({
  name:       'Chef Regina Faustino',
  photo_url:  '',
  bio:        'With over 12 years in Japanese fine-dining kitchens across Tokyo and Manila, Chef Regina brings the precision and artistry of Michelin-star pastry to intimate group classes designed for serious home cooks and aspiring Head Chefs.',
  credentials: [
    'Le Cordon Bleu, Paris — Pâtisserie Diploma',
    'Nihonbashi Yukari, Tokyo — 3-year tenure',
    'ABCT Japanese Restaurant — Executive Head Chef',
    'Featured in Manila Bulletin 2023',
  ] as string[],
})

// ── Load saved content from DB ────────────────────────

onMounted(async () => {
  const keys = ['home_hero', 'home_shop_teaser', 'home_chef', 'about_chef', 'about_timeline', 'about_press', 'about_socials', 'classes_hero', 'classes_instructor']
  const results = await Promise.allSettled(keys.map(k => $fetch(`/api/content/${k}`)))

  const [heroData, shopData, homeChefData, chefData, timelineData, pressData, socialsData, classesHeroData, instructorData] = results.map(r =>
    r.status === 'fulfilled' ? r.value : null
  )

  if (heroData)          Object.assign(hero, heroData)
  if (shopData)          Object.assign(shopTeaser, shopData)
  if (homeChefData)      Object.assign(homeChef, homeChefData)
  if (chefData)          Object.assign(chef, chefData)
  if (timelineData)      timeline.value    = timelineData as any[]
  if (pressData)         press.value       = pressData as string[]
  if (socialsData)       socials.value     = socialsData as any[]
  if (classesHeroData)   Object.assign(classesHero, classesHeroData)
  if (instructorData)    Object.assign(instructor, instructorData)
})

// ── Save ──────────────────────────────────────────────

const save = async (key: string, value: any) => {
  saving.value = key
  saved.value  = null
  try {
    await $fetch('/api/admin/content', {
      method: 'PUT',
      body: { key, value: JSON.parse(JSON.stringify(value)) },
    })
    saved.value = key
    setTimeout(() => { if (saved.value === key) saved.value = null }, 3000)
  } catch (e) {
    alert('Save failed. Please try again.')
  } finally {
    saving.value = null
  }
}
</script>

<style scoped>
.field-label {
  @apply block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2;
}
.field-input {
  @apply w-full bg-charcoal-900 border border-charcoal-600 text-cream-100 font-sans text-sm px-4 py-2.5 focus:outline-none focus:border-gold/60 resize-y transition-colors;
}
</style>
