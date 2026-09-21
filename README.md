# KodexA Compiler

A secure and multi-language online compiler platform supporting C++, Java, and Python.

KodexA Compiler allows users to write code directly in a web-based editor or upload source files, automatically detects the programming language, and executes the submitted code inside isolated Docker environments.

The platform provides clear execution results and error feedback while maintaining a modular architecture designed for security, extensibility, and maintainability.

## Overview

Modern developers and learners increasingly rely on online programming environments to write, test, and execute code without installing or configuring complete development environments locally.

KodexA Compiler addresses this need by providing a unified web-based environment for multiple programming languages.

Users can either:

- Write source code directly in the online editor.
- Upload an existing source file.
- Let the platform automatically detect the programming language.
- Compile or interpret the submitted code.
- Execute the program inside an isolated environment.
- View the execution output or a clear error message.

The platform currently supports:

- C++
- Java
- Python

## Key Features

- Multi-language code execution
- Support for C++, Java, and Python
- Online code editor
- Syntax highlighting
- Source-file upload
- Automatic programming-language detection
- Compilation and execution on demand
- Clear compilation and runtime error reporting
- Docker-based execution isolation
- REST API communication between frontend and backend
- Modular architecture
- Extensible language support

## Supported Languages

| Language | Detection | Execution |
|----------|-----------|-----------|
| Python | File extension / keywords | Interpretation |
| Java | File extension / keywords | Compilation + execution |
| C++ | File extension / keywords | Compilation + execution |

## Language Detection

KodexA Compiler automatically determines the programming language before execution.

### File Upload

When the user uploads a source file, the language is detected from its extension.

Examples:

- `.py` → Python
- `.java` → Java
- `.cpp` → C++

### Manual Code Input

When code is entered directly into the editor, the system analyzes characteristic keywords and syntax patterns to identify the most likely language.

Examples include:

- `import` and Python-specific syntax → Python
- `public static void` → Java
- `#include` → C++

This allows users to execute code without manually selecting a language in every case.

## Code Execution Workflow

The main execution workflow is:

User
→ Online Code Editor / File Upload
→ Language Detection
→ REST API
→ Backend
→ Docker Isolated Environment
→ Compilation / Interpretation
→ Program Execution
→ Output / Error
→ User Interface

This separation allows the application to handle the user interface, language detection, backend processing, and code execution as distinct components.

## Docker-Based Isolation

Executing arbitrary user-submitted code introduces important security risks.

KodexA Compiler addresses this challenge by executing submitted programs inside isolated Docker containers.

The containerized execution environment provides a separation between the submitted code and the main application environment.

The execution process can be summarized as:

Source Code
→ Docker Container
→ Compiler / Interpreter
→ Program Execution
→ Captured Output
→ Application Response

This architecture helps reduce the risks associated with executing untrusted code directly on the host environment.

## Error Handling

The platform distinguishes between successful execution and failed execution.

When execution succeeds, the user receives:

- Detected programming language
- Program output

When execution fails, the platform provides an error response describing the problem.

Errors can occur during:

- Language detection
- Compilation
- Program execution
- Runtime processing

Providing clear feedback makes the platform useful not only for execution but also for debugging and learning.

## Online Code Editor

KodexA Compiler provides an integrated code editor designed to make code submission accessible directly from the browser.

The editor supports:

- Direct code input
- Syntax highlighting
- Code execution
- Error feedback
- Multi-language source code

This eliminates the need for users to install separate compilers or interpreters before testing their programs.

## File Upload

Users can upload existing source-code files instead of manually copying their code into the editor.

The uploaded file is processed by the backend, its language is detected from the file extension, and the source code is then sent to the appropriate execution environment.

## REST API

The frontend communicates with the backend through a REST API.

The API is responsible for receiving source code, processing execution requests, interacting with the appropriate execution environment, and returning the result to the frontend.

This separation between frontend and backend contributes to a modular architecture and makes future extensions easier.

## Architecture

The platform follows a modular architecture composed of several major components.

### Frontend

Responsible for:

- Code editing
- File upload
- User interaction
- Execution requests
- Displaying results and errors

### Backend

Responsible for:

- Receiving requests
- Detecting programming languages
- Processing source code
- Selecting the appropriate execution strategy
- Communicating with Docker
- Returning execution results

### Docker Execution Layer

Responsible for:

- Creating isolated execution environments
- Compiling source code when required
- Interpreting supported languages
- Running submitted programs
- Capturing execution output and errors

### Communication Layer

A REST API connects the frontend with the backend and allows execution requests and results to be exchanged in a structured manner.

## Technologies

- Python
- C++
- Java
- Docker
- REST API
- HTML
- CSS
- JavaScript
- Web-based Code Editor
- Containerization

## Project Objectives

The main objectives of KodexA Compiler are:

- Provide a unified environment for multiple programming languages.
- Simplify code execution through a web interface.
- Automatically detect the submitted programming language.
- Isolate code execution using Docker containers.
- Provide useful compilation and runtime feedback.
- Maintain a modular and extensible architecture.
- Improve accessibility for students, developers, and programming learners.

## Security Considerations

Executing arbitrary source code requires strong isolation mechanisms.

The project therefore uses containerization to separate user-submitted programs from the main application environment.

Security considerations include:

- Container-based isolation
- Separation between application and execution environments
- Controlled execution workflow
- Permission management
- Protection of the host environment from direct code execution

In a production environment, additional restrictions such as CPU limits, memory limits, execution timeouts, restricted networking, filesystem isolation, and container hardening should also be considered.

## Project Structure

The exact project structure depends on the implementation, but the platform is organized around the main components required for:

- Frontend interaction
- Backend processing
- REST API communication
- Language detection
- Docker-based execution
- Compilation and interpretation
- Result handling

## Getting Started

### Prerequisites

Make sure the following are installed:

- Python
- Docker
- Git

Docker must be running because submitted programs are executed inside containers.

### Installation

Clone the repository:

    git clone https://github.com/Bouchra20252/pfa.compiler.git

Navigate to the project directory:

    cd pfa.compiler

Create a Python virtual environment if required:

    python -m venv .venv

Activate the environment on Windows:

    .venv\Scripts\activate

Install the required Python dependencies:

    pip install -r requirements.txt

### Running the Application

Start Docker and launch the backend/frontend components according to the project configuration.

The web interface can then be accessed through the configured local development address.

## Example Workflow

A typical execution session follows these steps:

1. The user opens the online compiler.
2. The user writes code or uploads a source file.
3. The system detects the programming language.
4. The code is sent to the backend through the REST API.
5. The backend prepares an isolated Docker environment.
6. The code is compiled or interpreted.
7. The program is executed.
8. The output or error is captured.
9. The result is returned to the frontend.
10. The user receives the execution result.

## Use Cases

KodexA Compiler can be used for:

- Programming education
- Learning and experimentation
- Quick code testing
- Prototyping
- Demonstrating multi-language execution
- Testing small programs without local compiler configuration

## Limitations

Although the platform provides isolated execution through Docker, executing arbitrary code remains a security-sensitive task.

A production-ready deployment should introduce additional sandboxing and resource controls, including:

- Execution time limits
- Memory limits
- CPU limits
- Restricted network access
- Read-only filesystem where appropriate
- Container privilege restrictions
- Process limits
- Stronger isolation mechanisms

These measures are particularly important when the platform is exposed to untrusted users over the internet.

## Future Improvements

Potential extensions include:

- Support for additional programming languages
- Real-time collaborative coding
- Code auto-completion
- Real-time syntax and error detection
- Persistent user workspaces
- Code saving and project management
- User authentication
- Execution history
- Multiple-file projects
- Terminal interaction
- Resource usage monitoring
- Advanced sandboxing
- Cloud deployment
- WebSocket-based real-time execution feedback

## Screenshots

Screenshots of the platform can be added here to demonstrate the main user experience.

Recommended screenshots include:

- Main compiler interface
- Code editor
- Language detection
- File upload
- Successful execution
- Compilation error
- Runtime error
- Docker execution result

## Project Context

KodexA Compiler was developed as a project focused on web-based programming environments, multi-language execution, software architecture, and secure code execution.

The project combines frontend development, backend processing, REST API communication, language detection, compilation and interpretation, and containerized execution into a unified platform.

## Author

**Simali Bouchra**

AI & Data Engineering Student

Morocco
