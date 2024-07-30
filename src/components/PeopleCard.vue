<template>
  <div v-if="showPersonCard" class="person-card">
    <div class="card">
      <div class="card-header">
        <button @click="goToList" class="btn btn-secondary bg-yellow-accent-3 py-1 px-3 mb-4 rounded">
          к списку
        </button>
      </div>
      <div class="card-body">
        <editable-person-info :readonly="!state.isEditing" label="Имя" :value="state.currentPerson.name"/>
        <editable-person-info :readonly="!state.isEditing" label="Рост" :value="state.currentPerson.height"/>
        <editable-person-info :readonly="!state.isEditing" label="Масса" :value="state.currentPerson.mass"/>
        <editable-person-info :readonly="!state.isEditing" label="Цвет волос" :value="state.currentPerson.hair_color"/>
        <editable-person-info :readonly="!state.isEditing" label="Цвет кожи" :value="state.currentPerson.skin_color"/>
        <editable-person-info :readonly="!state.isEditing" label="Цвет глаз" :value="state.currentPerson.eye_color"/>
        <editable-person-info :readonly="!state.isEditing" label="Год рождения"
                              :value="state.currentPerson.birth_year"/>
        <editable-person-info :readonly="!state.isEditing" label="Гендер" :value="state.currentPerson.gender"/>
        <editable-person-info :readonly="!state.isEditing" label="Родина" :value="state.currentPerson.homeworld"/>
        <editable-person-info :readonly="!state.isEditing" label="Фильмы" :value="currentPersonFilms"/>
      </div>
      <!--      Со всеми полями-->
      <!--      <div class="card-body">-->
      <!--        <div v-for="(info, label) in state.currentPerson" :key="label">-->
      <!--          <editable-person-info-->
      <!--            :readonly="!state.isEditing"-->
      <!--            :label="label"-->
      <!--            :value="info"-->
      <!--          />-->
      <!--        </div>-->
      <!--      </div>-->
      <v-col cols="12" class="d-flex justify-center mb-5">
        <button
          @click="toggleEditMode"
          class="btn btn-secondary bg-yellow-accent-3 py-2 px-6 rounded">
          {{ state.isEditing ? 'Сохранить' : 'Изменить' }}
        </button>
      </v-col>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, watch} from 'vue';
import {Film, People, Planet} from "@/core/schemas";
import {API} from "@/core/services/api/base";
import {SWAPI} from "@/core/services/api";
import router from "@/router";

const props = defineProps({
  showPersonCard: {
    type: Boolean,
    required: true,
  },
});

const route = useRoute();

const state = reactive({
  currentPerson: <People>{},
  isEditing: false
});

async function fetchPersonDetails() {
  try {
    await SWAPI.fetchPerson(currentPersonId.value).then(async (data: People) => {
      state.currentPerson = data;
      const filmTitles = await Promise.all(
        data.films.map(async (filmUrl): Promise<string> => (await API.fetchFromURL<Film>(filmUrl)).title),
      );
      state.currentPerson.films = filmTitles;
      const currentPersonPlanet: Planet = await API.fetchFromURL<Planet>(state.currentPerson.homeworld);
      state.currentPerson.homeworld = currentPersonPlanet.name;
    });
  } catch (error) {
    console.error('Error fetching person details:', error);
  }
}

function toggleEditMode() {
  state.isEditing = !state.isEditing;
}

function goToList() {
  router.push({name: 'PeopleList'});
}

const currentPersonFilms = computed(() => state.currentPerson.films?.join(', '));
const currentPersonId = computed(() => route.params.id as string);
const showPersonCard = computed(() => props.showPersonCard || true);

watch(() => route.params.id, () => {
    fetchPersonDetails();
  }
);

onMounted(() => {
  fetchPersonDetails();
});
</script>

<style scoped>
.person-card {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.card {
  max-width: 600px;
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
