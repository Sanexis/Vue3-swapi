<template>
  <v-container class="fill-height">
    <v-responsive class="align-center fill-height mx-auto" max-width="900">
      <v-img class="mb-4" max-height="150" src="@/assets/logo.png" />

      <v-row>
        <v-col cols="12">
          <v-sheet class="mx-auto bg-transparent" max-width="500">
            <v-form class="transparent" @submit.prevent="searchPeople">
              <v-text-field v-model="searchQuery" label="Имя персонажа"></v-text-field>
              <v-btn class="mt-2 bg-yellow-accent-3" height="50" type="submit" block>
                Искать
              </v-btn>
            </v-form>
          </v-sheet>
        </v-col>

        <v-col cols="12">
          <div v-if="isLoading" class="d-flex justify-center mt-16">
            <v-progress-circular color="yellow-accent-3" indeterminate :size="60"></v-progress-circular>
          </div>

          <div v-if="!isLoading && people.length === 0" class="d-flex justify-center mt-16">
            <p>Совпадений не найдено.</p>
          </div>

          <div v-if="!isLoading && people.length > 0">
            <v-card
              v-for="person in people"
              :key="person.url"
              @click="showPersonDetails(person.url)"
              class="py-4 mb-4"
              color="surface-variant"
              prepend-icon="mdi-star-circle-outline"
              rounded="lg"
              :title="person.name"
              variant="text"
            >
              <v-overlay opacity=".06" scrim="primary" contained model-value persistent />
            </v-card>

            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              rounded="circle"
              @update:modelValue="handlePageChange"
              :total-visible="4"
              v-if="totalPages > 1"
            />
          </div>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { SWAPI } from "@/core/services/api";
import { People, PeopleResponse } from "@/core/schemas";
import router from "@/router";

const searchQuery = ref('');
const people = ref<{ name: string, url: string }[]>([]);
const currentPage = ref(1);
const totalPages = ref(0);
const isLoading = ref(false);
const emits = defineEmits(['show-person-details']);

const loadPeople = async () => {
  isLoading.value = true;
  await SWAPI.fetchPeople(currentPage.value).then((data: PeopleResponse) => {
    people.value = data.results.map((people: People) => ({ name: people.name, url: people.url }));
    totalPages.value = Math.ceil(data.count / 10);
    isLoading.value = false;
  }).catch(() => {
    isLoading.value = false;
  });
};

const searchPeople = async () => {
  isLoading.value = true;
  await SWAPI.searchPeople(searchQuery.value).then((data: PeopleResponse) => {
    people.value = data.results.map((people: People) => ({ name: people.name, url: people.url }));
    totalPages.value = Math.ceil(data.count / 10);
    currentPage.value = 1;
    isLoading.value = false;
  }).catch(() => {
    isLoading.value = false;
  });
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadPeople();
};

function showPersonDetails(url: string) {
  const lastValue = url.split("/").filter(Boolean).pop();
  router.push({ name: 'PeopleCard', params: { id: lastValue } });
}

onMounted(() => {
  loadPeople();
});
</script>
