/**
 * Quiz Sample Data
 */

import type { ToolSample } from "../common";

export const SAMPLES: ToolSample[] = [
  {
    name: "Geography Quiz",
    args: {
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
    args: {
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
    args: {
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
    args: {
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
    args: {
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
