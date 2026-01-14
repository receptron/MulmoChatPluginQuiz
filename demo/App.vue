<template>
  <div class="demo-container">
    <h1>Quiz Plugin Demo</h1>

    <!-- JSON Data Input Section -->
    <div class="section">
      <h2>JSON Data Input</h2>
      <div class="preset-buttons">
        <button
          v-for="(preset, index) in presets"
          :key="index"
          @click="loadPreset(preset)"
          class="preset-btn"
        >
          {{ preset.name }}
        </button>
      </div>
      <textarea
        v-model="jsonInput"
        class="json-input"
        placeholder="Enter QuizData JSON here..."
        rows="10"
      ></textarea>
      <div class="input-actions">
        <button @click="applyJson" class="apply-btn">Apply JSON</button>
        <span v-if="jsonError" class="error">{{ jsonError }}</span>
      </div>
    </div>

    <div class="section">
      <h2>QuizView Component</h2>
      <div class="component-wrapper">
        <QuizView
          :selectedResult="quizResult"
          :sendTextMessage="handleSendTextMessage"
          @updateResult="handleUpdate"
        />
      </div>
      <div v-if="lastSentMessage" class="sent-message">
        <strong>Sent Message:</strong>
        <pre>{{ lastSentMessage }}</pre>
      </div>
    </div>

    <div class="section">
      <h2>QuizPreview Component</h2>
      <div class="preview-wrapper">
        <QuizPreview :result="quizResult" />
      </div>
    </div>

    <div class="section">
      <h2>Current Result Data</h2>
      <pre>{{ JSON.stringify(quizResult, null, 2) }}</pre>
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

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #f5f5f5;
}

.demo-container {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
}

h2 {
  color: #555;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.component-wrapper {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 16px;
}

.preview-wrapper {
  max-width: 200px;
}

pre {
  background: #f8f8f8;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}

/* JSON Input Styles */
.preset-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.preset-btn {
  padding: 8px 16px;
  background: #e0e7ff;
  border: 1px solid #c7d2fe;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #4338ca;
  transition: all 0.2s;
}

.preset-btn:hover {
  background: #c7d2fe;
  border-color: #a5b4fc;
}

.json-input {
  width: 100%;
  padding: 12px;
  font-family: "Monaco", "Menlo", monospace;
  font-size: 13px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  resize: vertical;
  background: #fafafa;
}

.json-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input-actions {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.apply-btn {
  padding: 10px 24px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.apply-btn:hover {
  background: #4338ca;
}

.error {
  color: #dc2626;
  font-size: 14px;
}

.sent-message {
  margin-top: 16px;
  padding: 12px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 6px;
}

.sent-message strong {
  color: #065f46;
  display: block;
  margin-bottom: 8px;
}

.sent-message pre {
  background: #d1fae5;
  margin: 0;
  white-space: pre-wrap;
}
</style>
