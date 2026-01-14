<template>
  <div class="quiz-container">
    <div v-if="quizData" class="quiz-content">
      <!-- Quiz Title -->
      <h2 v-if="quizData.title" class="quiz-title">
        {{ quizData.title }}
      </h2>

      <!-- Questions -->
      <div class="questions-list">
        <div
          v-for="(question, qIndex) in quizData.questions"
          :key="qIndex"
          class="question-card"
        >
          <!-- Question Text -->
          <div class="question-text">
            <span class="question-number">{{ qIndex + 1 }}.</span>
            {{ question.question }}
          </div>

          <!-- Answer Choices -->
          <div class="choices-list">
            <label
              v-for="(choice, cIndex) in question.choices"
              :key="cIndex"
              :class="getChoiceClass(qIndex, cIndex)"
              class="choice-label"
            >
              <input
                type="radio"
                :name="`question-${qIndex}`"
                :value="cIndex"
                v-model="userAnswers[qIndex]"
                class="choice-radio"
              />
              <span class="choice-text">
                <span class="choice-letter">{{ String.fromCharCode(65 + cIndex) }}.</span>
                {{ choice }}
              </span>
            </label>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="submit-section">
        <button
          @click="handleSubmit"
          :disabled="!allQuestionsAnswered"
          :class="allQuestionsAnswered ? 'submit-btn-active' : 'submit-btn-disabled'"
          class="submit-btn"
        >
          Submit Answers
        </button>
      </div>

      <!-- Progress Indicator -->
      <div class="progress-text">
        {{ answeredCount }} / {{ quizData.questions.length }} questions answered
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { ToolResult } from "../types";
import type { QuizData } from "../plugin";

const props = defineProps<{
  selectedResult: ToolResult;
  sendTextMessage: (text?: string) => void;
}>();

const emit = defineEmits<{
  updateResult: [result: ToolResult];
}>();

const quizData = ref<QuizData | null>(null);
const userAnswers = ref<(number | null)[]>([]);

watch(
  () => props.selectedResult,
  (newResult) => {
    if (newResult?.toolName === "putQuestions" && newResult.jsonData) {
      quizData.value = newResult.jsonData as QuizData;
      // Restore user answers from viewState or initialize new array
      if (newResult.viewState?.userAnswers) {
        userAnswers.value = newResult.viewState.userAnswers as (number | null)[];
      } else {
        userAnswers.value = new Array(quizData.value.questions.length).fill(null);
      }
    }
  },
  { immediate: true },
);

// Watch userAnswers and save to viewState whenever they change
watch(
  userAnswers,
  (newAnswers) => {
    if (props.selectedResult && newAnswers) {
      const updatedResult: ToolResult = {
        ...props.selectedResult,
        viewState: {
          userAnswers: newAnswers,
        },
      };
      emit("updateResult", updatedResult);
    }
  },
  { deep: true },
);

const answeredCount = computed(() => {
  return userAnswers.value.filter((answer) => answer !== null).length;
});

const allQuestionsAnswered = computed(() => {
  return quizData.value && answeredCount.value === quizData.value.questions.length;
});

function getChoiceClass(qIndex: number, cIndex: number): string {
  const isSelected = userAnswers.value[qIndex] === cIndex;
  if (isSelected) {
    return "choice-selected";
  }
  return "choice-default";
}

function handleSubmit(): void {
  if (!quizData.value || !allQuestionsAnswered.value) return;

  // Format answers as text
  const answerText = userAnswers.value
    .map((answer, index) => {
      if (answer === null) return null;
      const questionNum = index + 1;
      const choiceLetter = String.fromCharCode(65 + answer);
      const choiceText = quizData.value!.questions[index].choices[answer];
      return `Q${questionNum}: ${choiceLetter} - ${choiceText}`;
    })
    .filter((text) => text !== null)
    .join("\n");

  const message = `Here are my answers:\n${answerText}`;
  props.sendTextMessage(message);
}
</script>

<style scoped>
.quiz-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 2rem;
  background: #1a1a2e;
}

.quiz-content {
  max-width: 48rem;
  width: 100%;
  margin: 0 auto;
}

.quiz-title {
  color: #f0f0f0;
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.question-card {
  background: #2d2d44;
  border-radius: 0.5rem;
  padding: 1.5rem;
  border: 2px solid #3d3d5c;
}

.question-text {
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.question-number {
  color: #60a5fa;
  margin-right: 0.5rem;
}

.choices-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.choice-label {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.choice-default {
  border-color: #4b4b6b;
}

.choice-default:hover {
  border-color: #6b6b8b;
  background: rgba(107, 107, 139, 0.2);
}

.choice-selected {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.2);
}

.choice-radio {
  margin-top: 0.25rem;
  margin-right: 0.75rem;
  height: 1rem;
  width: 1rem;
  flex-shrink: 0;
}

.choice-text {
  color: white;
  flex: 1;
}

.choice-letter {
  font-weight: 600;
  margin-right: 0.5rem;
}

.submit-section {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.submit-btn {
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  color: white;
  font-weight: 600;
  font-size: 1.125rem;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;
}

.submit-btn-active {
  background-color: #2563eb;
}

.submit-btn-active:hover {
  background-color: #1d4ed8;
}

.submit-btn-disabled {
  background-color: #4b5563;
  cursor: not-allowed;
  opacity: 0.5;
}

.progress-text {
  margin-top: 1rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
}
</style>
