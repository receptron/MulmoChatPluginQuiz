<template>
  <div class="quiz-preview">
    <div v-if="quizData" class="preview-content">
      <!-- Quiz Title -->
      <div class="preview-title">
        {{ quizData.title || "Quiz" }}
      </div>

      <!-- Question Count -->
      <div class="preview-count">
        <span class="count-badge">
          {{ quizData.questions.length }}
          {{ quizData.questions.length === 1 ? "Question" : "Questions" }}
        </span>
      </div>

      <!-- Mini Preview of First Question -->
      <div class="preview-question">
        {{ quizData.questions[0]?.question }}
      </div>

      <!-- Choice indicators -->
      <div class="preview-choices">
        <div
          v-for="(_, index) in Math.min(quizData.questions[0]?.choices.length || 0, 4)"
          :key="index"
          class="choice-dot"
        ></div>
        <div
          v-if="(quizData.questions[0]?.choices.length || 0) > 4"
          class="more-choices"
        >
          +{{ quizData.questions[0].choices.length - 4 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ToolResult } from "../types";
import type { QuizData } from "../plugin";

const props = defineProps<{
  result: ToolResult;
}>();

const quizData = computed(() => props.result.jsonData as QuizData | null);
</script>

<style scoped>
.quiz-preview {
  padding: 0.75rem;
  background: #eff6ff;
  border-radius: 0.375rem;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
}

.preview-count {
  text-align: center;
}

.count-badge {
  display: inline-block;
  background: #2563eb;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.preview-question {
  font-size: 0.75rem;
  color: #4b5563;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.preview-choices {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
}

.choice-dot {
  width: 0.5rem;
  height: 0.5rem;
  background: #9ca3af;
  border-radius: 9999px;
}

.more-choices {
  font-size: 0.75rem;
  color: #6b7280;
}
</style>
