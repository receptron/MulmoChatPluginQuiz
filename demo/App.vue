<template>
  <div class="max-w-3xl mx-auto">
    <h1 class="text-gray-800 mb-8">Quiz Plugin Demo</h1>

    <!-- JSON Data Input Section -->
    <div class="bg-white rounded-lg p-5 mb-5 shadow-md">
      <h2 class="text-gray-600 text-xl mb-4">JSON Data Input</h2>
      <div class="flex flex-wrap gap-2 mb-3">
        <button
          v-for="(preset, index) in presets"
          :key="index"
          @click="loadPreset(preset)"
          class="py-2 px-4 bg-indigo-100 border border-indigo-200 rounded-md cursor-pointer text-sm text-indigo-700 transition-all hover:bg-indigo-200 hover:border-indigo-300"
        >
          {{ preset.name }}
        </button>
      </div>
      <textarea
        v-model="jsonInput"
        class="w-full p-3 font-mono text-sm border border-gray-300 rounded-md resize-y bg-gray-50 focus:outline-none focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/10"
        placeholder="Enter QuizData JSON here..."
        rows="10"
      ></textarea>
      <div class="mt-3 flex items-center gap-3">
        <button @click="applyJson" class="py-2.5 px-6 bg-indigo-600 text-white border-none rounded-md cursor-pointer text-sm font-medium transition-colors hover:bg-indigo-700">Apply JSON</button>
        <span v-if="jsonError" class="text-red-600 text-sm">{{ jsonError }}</span>
      </div>
    </div>

    <div class="bg-white rounded-lg p-5 mb-5 shadow-md">
      <h2 class="text-gray-600 text-xl mb-4">QuizView Component</h2>
      <div class="border border-gray-200 rounded p-4">
        <QuizView
          :selectedResult="quizResult"
          :sendTextMessage="handleSendTextMessage"
          @updateResult="handleUpdate"
        />
      </div>
      <div v-if="lastSentMessage" class="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-md">
        <strong class="text-emerald-800 block mb-2">Sent Message:</strong>
        <pre class="bg-emerald-100 m-0 whitespace-pre-wrap">{{ lastSentMessage }}</pre>
      </div>
    </div>

    <div class="bg-white rounded-lg p-5 mb-5 shadow-md">
      <h2 class="text-gray-600 text-xl mb-4">QuizPreview Component</h2>
      <div class="max-w-[200px]">
        <QuizPreview :result="quizResult" />
      </div>
    </div>

    <div class="bg-white rounded-lg p-5 mb-5 shadow-md">
      <h2 class="text-gray-600 text-xl mb-4">Current Result Data</h2>
      <pre class="bg-gray-100 p-3 rounded overflow-x-auto text-xs">{{ JSON.stringify(quizResult, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { QuizView, QuizPreview } from "../src/index";
import type { ToolResult } from "../src/types";
import type { QuizData } from "../src/plugin";

// Preset dummy data
const presets = [
  {
    name: "Geography Quiz",
    data: {
      title: "World Geography",
      questions: [
        {
          question: "What is the capital of France?",
          choices: ["London", "Berlin", "Paris", "Madrid"],
          correctAnswer: 2,
        },
        {
          question: "Which is the largest ocean?",
          choices: ["Atlantic", "Indian", "Arctic", "Pacific"],
          correctAnswer: 3,
        },
        {
          question: "Mount Everest is located in which mountain range?",
          choices: ["Alps", "Andes", "Himalayas", "Rockies"],
          correctAnswer: 2,
        },
      ],
    },
  },
  {
    name: "Science Quiz",
    data: {
      title: "Science Basics",
      questions: [
        {
          question: "Which planet is known as the Red Planet?",
          choices: ["Venus", "Mars", "Jupiter", "Saturn"],
          correctAnswer: 1,
        },
        {
          question: "What is the chemical symbol for water?",
          choices: ["O2", "CO2", "H2O", "NaCl"],
          correctAnswer: 2,
        },
        {
          question: "How many bones are in the adult human body?",
          choices: ["186", "206", "226", "246"],
          correctAnswer: 1,
        },
        {
          question: "What is the speed of light?",
          choices: [
            "300,000 km/s",
            "150,000 km/s",
            "500,000 km/s",
            "1,000,000 km/s",
          ],
          correctAnswer: 0,
        },
      ],
    },
  },
  {
    name: "Math Quiz",
    data: {
      title: "Math Challenge",
      questions: [
        {
          question: "What is 15 x 15?",
          choices: ["200", "215", "225", "250"],
          correctAnswer: 2,
        },
        {
          question: "What is the square root of 144?",
          choices: ["10", "11", "12", "13"],
          correctAnswer: 2,
        },
      ],
    },
  },
  {
    name: "No Correct Answer",
    data: {
      title: "Opinion Poll",
      questions: [
        {
          question: "What is your favorite color?",
          choices: ["Red", "Blue", "Green", "Yellow"],
        },
        {
          question: "Which season do you prefer?",
          choices: ["Spring", "Summer", "Autumn", "Winter"],
        },
      ],
    },
  },
  {
    name: "Single Question",
    data: {
      title: "Quick Question",
      questions: [
        {
          question: "Is this quiz plugin working correctly?",
          choices: ["Yes", "No"],
          correctAnswer: 0,
        },
      ],
    },
  },
];

const jsonInput = ref("");
const jsonError = ref("");
const lastSentMessage = ref("");

const quizResult = ref<ToolResult<never, QuizData>>({
  toolName: "putQuestions",
  message: "Quiz ready",
  title: "",
  jsonData: undefined,
});

const loadPreset = (preset: { name: string; data: QuizData }) => {
  jsonInput.value = JSON.stringify(preset.data, null, 2);
  jsonError.value = "";
  applyJson();
};

const applyJson = () => {
  try {
    const data = JSON.parse(jsonInput.value) as QuizData;
    if (!data.questions || !Array.isArray(data.questions)) {
      throw new Error("Invalid QuizData: questions array is required");
    }
    quizResult.value = {
      toolName: "putQuestions",
      message: "Quiz ready",
      title: data.title || "Quiz",
      jsonData: data,
    };
    jsonError.value = "";
    lastSentMessage.value = "";
  } catch (e) {
    jsonError.value = e instanceof Error ? e.message : "Invalid JSON";
  }
};

const handleSendTextMessage = (text?: string) => {
  lastSentMessage.value = text || "";
  console.log("sendTextMessage called:", text);
};

const handleUpdate = (updated: ToolResult<never, QuizData>) => {
  quizResult.value = updated;
  console.log("Quiz updated:", updated);
};

// Load first preset on mount
onMounted(() => {
  loadPreset(presets[0]);
});
</script>
