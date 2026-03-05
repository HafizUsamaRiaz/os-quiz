export const ALL_QUESTIONS = [
  // ── Lab 1: Linux CLI ─────────────────────────────────────────
  {
    id: 1, lab: "Lab 1",
    question: "You are inside /home/ali/documents. Which command shows the full path of your current location?",
    options: ["ls -la", "pwd", "cd ~", "file ."],
    answer: "pwd",
    explanation: "pwd (Print Working Directory) displays the absolute path of the current directory."
  },
  {
    id: 2, lab: "Lab 1",
    question: "Which ls flag reveals hidden files (names starting with a dot)?",
    options: ["-l", "-h", "-a", "-r"],
    answer: "-a",
    explanation: "ls -a shows ALL entries including hidden ones (starting with '.')."
  },
  {
    id: 3, lab: "Lab 1",
    question: "You want to remove every file starting with 'g' and ending with '.txt'. Which command is correct?",
    options: ["rm *.txt", "rm g*.txt", "rm g?txt", "rm -r g.txt"],
    answer: "rm g*.txt",
    explanation: "The wildcard g*.txt matches any filename starting with 'g' followed by anything, ending in '.txt'."
  },
  {
    id: 4, lab: "Lab 1",
    question: "Which statement about command pipelines is FALSE?",
    options: [
      "A pipe sends stdout of one command to stdin of another",
      "You can chain more than two commands with pipes",
      "Pipelines can replace file I/O redirection in ALL cases",
      "ls | grep '.txt' filters ls output for .txt files"
    ],
    answer: "Pipelines can replace file I/O redirection in ALL cases",
    explanation: "Pipes connect commands in memory — they cannot save output to a file. You still need '>' for that."
  },
  {
    id: 5, lab: "Lab 1",
    question: "What does 'cat file1.txt > output.txt' do?",
    options: [
      "Appends file1.txt to output.txt",
      "Shows both files together on screen",
      "Writes file1.txt into output.txt, overwriting it",
      "Creates a copy of output.txt inside file1.txt"
    ],
    answer: "Writes file1.txt into output.txt, overwriting it",
    explanation: "'>' redirects stdout to a file, overwriting it. Use '>>' to append instead."
  },
  {
    id: 6, lab: "Lab 1",
    question: "What is the effect of:\nmkdir projects && cd projects && pwd\n(starting from /home/student)?",
    options: [
      "Creates 'projects', enters it, prints /home/student/projects",
      "Creates 'projects' but stays in /home/student",
      "Error: cannot chain these commands",
      "Creates 'projects', enters it, prints /home/student"
    ],
    answer: "Creates 'projects', enters it, prints /home/student/projects",
    explanation: "'&&' chains commands sequentially. mkdir creates the dir, cd enters it, pwd prints the new path."
  },
  {
    id: 7, lab: "Lab 1",
    question: "The 'less' command is used to:",
    options: [
      "Delete files smaller than a threshold",
      "View file content one screen at a time",
      "Reduce the size of a file",
      "Show only the last lines of a file"
    ],
    answer: "View file content one screen at a time",
    explanation: "'less' is a pager — it lets you scroll through file content page by page."
  },
  {
    id: 8, lab: "Lab 1",
    question: "Which command renames 'report.txt' to 'final.txt'?",
    options: ["cp report.txt final.txt", "mv report.txt final.txt", "touch final.txt report.txt", "cat report.txt > final.txt"],
    answer: "mv report.txt final.txt",
    explanation: "'mv' both moves and renames files. Within the same directory, it renames."
  },
  {
    id: 9, lab: "Lab 1",
    question: "What does 'touch newfile.txt' do if 'newfile.txt' does NOT yet exist?",
    options: [
      "Opens newfile.txt in a text editor",
      "Creates an empty file named newfile.txt",
      "Prints the contents of newfile.txt",
      "Deletes newfile.txt"
    ],
    answer: "Creates an empty file named newfile.txt",
    explanation: "'touch' creates an empty file if it doesn't exist; if it does exist, it updates its timestamp."
  },
  {
    id: 10, lab: "Lab 1",
    question: "Which command would show detailed info (permissions, size, date) about files in a directory?",
    options: ["ls", "ls -a", "ls -l", "ls -h"],
    answer: "ls -l",
    explanation: "ls -l gives a long listing format with permissions, owner, size, and modification date."
  },

  // ── Lab 2: GCC & GDB ─────────────────────────────────────────
  {
    id: 11, lab: "Lab 2",
    question: "Running 'gcc -c main.c' produces:",
    options: [
      "An executable called main",
      "An object file called main.o",
      "A preprocessed file called main.i",
      "A shared library called main.so"
    ],
    answer: "An object file called main.o",
    explanation: "The -c flag compiles without linking, producing an object file (.o)."
  },
  {
    id: 12, lab: "Lab 2",
    question: "In GDB, what does 'break 15' do?",
    options: [
      "Breaks after running 15 instructions",
      "Sets a breakpoint at line 15 of the source file",
      "Deletes breakpoint number 15",
      "Runs for 15 seconds then pauses"
    ],
    answer: "Sets a breakpoint at line 15 of the source file",
    explanation: "'break N' sets a breakpoint at line N so execution pauses there."
  },
  {
    id: 13, lab: "Lab 2",
    question: "Which GDB command executes the current line WITHOUT stepping into any function calls?",
    options: ["step", "next", "continue", "finish"],
    answer: "next",
    explanation: "'next' steps over function calls. 'step' enters them. 'continue' runs to the next breakpoint."
  },
  {
    id: 14, lab: "Lab 2",
    question: "In GDB, the command 'd 1 2' does what?",
    options: [
      "Displays variables 1 and 2",
      "Deletes breakpoints numbered 1 and 2",
      "Duplicates lines 1 and 2",
      "Disassembles functions 1 and 2"
    ],
    answer: "Deletes breakpoints numbered 1 and 2",
    explanation: "'d' is shorthand for 'delete'. 'd 1 2' removes breakpoints with IDs 1 and 2."
  },
  {
    id: 15, lab: "Lab 2",
    question: "To compile hello.c and produce an executable named 'hello', which command is correct?",
    options: ["gcc hello.c", "gcc -c hello.c -o hello", "gcc hello.c -o hello", "gcc --exec hello.c hello"],
    answer: "gcc hello.c -o hello",
    explanation: "gcc <source> -o <name> compiles and links, producing an executable with the given name."
  },
  {
    id: 16, lab: "Lab 2",
    question: "Which correctly describes GCC's compilation stages in order?",
    options: [
      "Preprocessing happens after assembly",
      "The linker runs before the assembler",
      "Preprocess → Compile → Assemble → Link",
      "Object files are produced by the linker"
    ],
    answer: "Preprocess → Compile → Assemble → Link",
    explanation: "GCC pipeline: Preprocessor (.i) → Compiler (.s) → Assembler (.o) → Linker (executable)."
  },
  {
    id: 17, lab: "Lab 2",
    question: "A global variable 'x = 10' exists. Inside main(), a local 'x = 5' is declared. What is x inside main()?",
    options: [
      "10 — global always takes priority",
      "5 — local variable shadows the global",
      "Both accessible as x and ::x in C",
      "This is a compile error in C"
    ],
    answer: "5 — local variable shadows the global",
    explanation: "In C, a local variable with the same name shadows the global within that scope."
  },
  {
    id: 18, lab: "Lab 2",
    question: "Which flag must you pass to gcc to enable debugging symbols for use with GDB?",
    options: ["-Wall", "-g", "-O2", "-std=c99"],
    answer: "-g",
    explanation: "The -g flag tells gcc to include debugging information (symbols, line numbers) in the binary."
  },

  // ── Lab 3: C File I/O ────────────────────────────────────────
  {
    id: 19, lab: "Lab 3",
    question: "You run: ./itucat file1.txt file2.txt\nWhat is the value of argc?",
    options: ["1", "2", "3", "0"],
    answer: "3",
    explanation: "argc counts all arguments including the program name: ./itucat, file1.txt, file2.txt → argc = 3."
  },
  {
    id: 20, lab: "Lab 3",
    question: "You run: ./itucat file1.txt file2.txt\nWhat does printf(\"%s\", argv[1]) print?",
    options: ["./itucat", "file1.txt", "file2.txt", "NULL"],
    answer: "file1.txt",
    explanation: "argv[0] is the program name, argv[1] is the first user argument — file1.txt."
  },
  {
    id: 21, lab: "Lab 3",
    question: "Which fopen() mode opens a file for reading only, returning NULL if the file doesn't exist?",
    options: ['"w"', '"r"', '"a"', '"r+"'],
    answer: '"r"',
    explanation: '"r" opens for reading only. If the file does not exist, fopen() returns NULL.'
  },
  {
    id: 22, lab: "Lab 3",
    question: "What is the correct purpose of fclose()?",
    options: [
      "Deletes a file from disk",
      "Flushes and releases the file pointer, freeing resources",
      "Rewinds the file to the beginning",
      "Converts file content to a string"
    ],
    answer: "Flushes and releases the file pointer, freeing resources",
    explanation: "fclose() flushes buffered writes and frees the FILE* resource. Forgetting it can cause data loss."
  },
  {
    id: 23, lab: "Lab 3",
    question: "Which function reads a line from a file into a buffer, stopping at newline or EOF?",
    options: ["fread()", "fwrite()", "fgets()", "fopen()"],
    answer: "fgets()",
    explanation: "fgets(buffer, size, fp) reads up to size-1 characters, stopping at newline or EOF."
  },
  {
    id: 24, lab: "Lab 3",
    question: "In the 'itugrep' task, your program replicates which Linux command?",
    options: ["cat", "zip", "grep", "ls"],
    answer: "grep",
    explanation: "grep searches for lines matching a pattern inside files — exactly what itugrep reimplements."
  },
  {
    id: 25, lab: "Lab 3",
    question: "What does fread(buf, 1, 512, fp) do?",
    options: [
      "Reads 1 block of 512 bytes from fp into buf",
      "Reads 512 items of 1 byte each from fp into buf",
      "Both above — they are equivalent",
      "Reads a formatted string of 512 characters"
    ],
    answer: "Both above — they are equivalent",
    explanation: "fread(ptr, size, count, fp): 512 items × 1 byte = 1 item × 512 bytes — same total bytes transferred."
  },
];
