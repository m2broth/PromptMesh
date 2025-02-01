# @m2broth/promptmesh

A framework-agnostic completion service that manages prompt templates and interactions with language models.

## Overview

This library provides a robust system for managing and processing prompt templates in applications that utilize language models. It implements a linked-list approach to prompt management, allowing for complex, context-aware prompts.

## Key Features

1. **Template-based Prompt Management**
   - Organized prompt structure using linked list of prompt template nodes
   - Each prompt template node can contain LLM responses
   - Support for dynamic context injection
   - Flexible template loading system

2. **Core Components**
   - Template Loader Interface for loading prompt templates
   - Prompt Template Processor for handling prompt chains
   - Completion Service for managing LLM interactions
   - Factory pattern for easy service instantiation

3. **Easy Integration**
   - Framework-agnostic design
   - Support for OpenAI's GPT models
   - Extensible architecture for different LLM providers

## Installation

```bash
npm install @m2broth/promptmesh
```

## Usage

### Basic Setup

```typescript
import { CompletionServiceFactory } from '@m2broth/promptmesh';

// Create a completion service with OpenAI configuration
const service = CompletionServiceFactory.create({
  OPENAI_API_KEY: 'your-api-key',
  GPT_MODEL: 'gpt-3.5-turbo',
  nunjucksConfig: {} // Optional Nunjucks configuration
});

// Use the service
const result = await service.askCompletion({
  prompts: [
    {
      name: 'example',
      template: 'Hello, {{ name }}!',
      params: { name: 'World' },
      isProcessResult: true
    }
  ]
});
```

### Testing Setup

For testing purposes, you can use the factory's helper method with mocked dependencies:

```typescript
import { CompletionServiceFactory } from '@m2broth/promptmesh';

// Create with mocked dependencies
const service = CompletionServiceFactory.createWithDependencies(
  mockCompletionProvider,
  mockTemplateLoader
);
```

### Manual Setup

```typescript
const templateLoader = new YourTemplateLoader();
const promptProcessor = new PromptTemplateProcessor();
const completionService = new AskCompletionService(templateLoader, promptProcessor);

const result = await completionService.askCompletion({
  prompts: [
    // Your prompt template nodes
  ],
  commonParams: {
    // Common parameters for all prompts
  }
});
```

## Dependencies

- Node.js
- OpenAI API (^3.3.0)
- Knex (^3.1.0)

## Development

### Prerequisites

1. Docker and Docker Compose installed
2. Node.js
3. OpenAI API key

### Database Setup

The project uses PostgreSQL for storing templates. Before running tests or starting development, you need to set up the database:

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Start the PostgreSQL container:
```bash
docker-compose up -d postgres
```

This will:
- Start PostgreSQL on port 5435
- Automatically run the initialization script from `src/migration/init.sql`
- Create necessary tables and indexes

### Environment Variables

Make sure your `.env` file contains:
```bash
PGUSER=postgres
PGPASSWORD=changeme
OPENAI_API_KEY=your_api_key_here
```

### Development Workflow

```bash
# Install dependencies
npm install

# Ensure database is running and migrations are applied
docker-compose up -d postgres

# Run tests
npm test

# Build the project
npm run build
```

### Troubleshooting

If you encounter database-related issues:

1. Check if the container is running:
```bash
docker-compose ps
```

2. View container logs:
```bash
docker-compose logs postgres
```

3. Restart the database (this will reset all data):
```bash
docker-compose down -v
docker-compose up -d postgres
```
