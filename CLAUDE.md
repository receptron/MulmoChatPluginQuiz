# CLAUDE.md

## Plugin Overview

Quiz plugin for MulmoChat. Create and display interactive multiple-choice quizzes.

## Common Guidelines

For standard plugin development guidelines, see:
https://github.com/receptron/GUIChatPluginTemplate/blob/main/CLAUDE.md

## Plugin-Specific Notes

### Features
- Multiple choice questions
- User answer tracking via viewState
- Answer submission to LLM for grading
- Support for both Vue and React

### Pattern Used
Uses "User Action → LLM Processing" pattern:
1. LLM creates quiz with correct answers in jsonData
2. User selects answers in UI
3. User submits via sendTextMessage()
4. LLM grades answers using jsonData

### Dependencies
- `gui-chat-protocol`: Core protocol for GUI Chat plugins

## Updating This Document

When making spec changes through discussion with Claude, update this file to reflect new constraints or architectural decisions.
