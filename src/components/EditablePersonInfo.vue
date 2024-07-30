<template>
  <v-responsive
    class="mx-auto"
  >
    <v-text-field
      :label="label"
      type="input"
      :model-value="value"
      :readonly="readonly"
    />
  </v-responsive>
</template>

<script setup lang="ts">
import {People} from "@/core/schemas";

defineProps<{
  label: string,
  value?: string[] | string,
  readonly?: boolean
}>();
</script>
