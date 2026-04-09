Gemini said
export const ALL_QUESTIONS = [
// ── Lab 4: Building a Linux-like Shell ──────────────────────────
{
id: 1, lab: "Lab 4",
question: "Which system call is used to create a new process that is an (almost) exact copy of the calling process?",
options: ["exec()", "wait()", "fork()", "exit()"],
answer: "fork()",
explanation: "The fork() system call creates a new child process by duplicating the calling parent process."
},
{
id: 2, lab: "Lab 4",
question: "What value does the fork() system call return to the newly created child process?",
options: ["The Parent's PID", "0", "1", "-1"],
answer: "0",
explanation: "While the parent receives the PID of the child, the child receives a return code of 0 to differentiate itself."
},
{
id: 3, lab: "Lab 4",
question: "Which system call is used to replace the current process image with a new program like 'ls' or 'wc'?",
options: ["fork()", "execv()", "wait()", "system()"],
answer: "execv()",
explanation: "The exec() family of calls overwrites the current process memory with a new executable's code and data."
},
{
id: 4, lab: "Lab 4",
question: "How should the itush shell handle multiple commands separated by the '&' operator?",
options: ["Run them sequentially", "Run them in parallel without waiting between starts", "Ignore the operator", "Exit the shell"],
answer: "Run them in parallel without waiting between starts",
explanation: "The ampersand (&) operator indicates parallel execution; the shell starts all processes before waiting for them to complete."
},

// ── Lab 5: Advanced Shell Features ──────────────────────────────
{
id: 5, lab: "Lab 5",
question: "Which symbol is used for output redirection in the itush shell?",
options: ["<", "&", "|", ">"],
answer: ">",
explanation: "The '>' character is used to reroute standard output (and in this lab, standard error) to a file."
},
{
id: 6, lab: "Lab 5",
question: "What should happen if the itush shell is passed a bad batch file or more than one argument at launch?",
options: ["Print an error and continue", "Ignore and open interactive mode", "Exit with code exit(1)", "Wait for user input"],
answer: "Exit with code exit(1)",
explanation: "Per the manual, if the shell is invoked incorrectly with bad files or extra arguments, it should terminate with exit(1)."
},
{
id: 7, lab: "Lab 5",
question: "In batch mode, what is the primary visual difference compared to interactive mode?",
options: ["The colors are different", "The 'itush>' prompt is not printed", "Commands are not executed", "Error messages are hidden"],
answer: "The 'itush>' prompt is not printed",
explanation: "In batch mode, the shell reads from a file and does not provide an interactive prompt to the user."
},

// ── Lab 6: Kernel Hacking (Xv6) ──────────────────────────────────
{
id: 8, lab: "Lab 6",
question: "Which file in Xv6 defines the system call numbers (e.g., #define SYS_fork 1)?",
options: ["kernel/syscall.c", "kernel/syscall.h", "user/user.h", "Makefile"],
answer: "kernel/syscall.h",
explanation: "kernel/syscall.h maps system call names to specific integer identifiers."
},
{
id: 9, lab: "Lab 6",
question: "After adding a new system call, which script generates the assembly stubs for user-level access?",
options: ["Makefile", "sysproc.c", "user/usys.pl", "kernel/types.h"],
answer: "user/usys.pl",
explanation: "The usys.pl script generates the actual assembly instructions that trigger the system call trap for user programs."
},
{
id: 10, lab: "Lab 6",
question: "Which file must you modify to ensure your new user program (e.g., myprog.c) is compiled into the Xv6 image?",
options: ["kernel/main.c", "Makefile", "user/user.h", "kernel/syscall.c"],
answer: "Makefile",
explanation: "You must add the program to the UPROGS section of the Makefile to include it in the file system image."
},

// ── Additional Practice Questions ────────────────────────────────
{
id: 11, lab: "Lab 4-5",
question: "fclose must be used after fopen, otherwise the program will not compile. True or false?",
options: ["True", "False"],
answer: "False",
explanation: "Failing to use fclose is a logical error (resource leak), but the compiler does not enforce it; the program will still compile."
},
{
id: 12, lab: "Lab 4-5",
question: "Which function would you use to write multiple-byte binary data, without formatting, to a stream?",
options: ["fprintf()", "fwrite()", "fputs()", "sprintf()"],
answer: "fwrite()",
explanation: "fwrite() is used for binary output of raw data blocks, whereas fprintf is for formatted text."
},
{
id: 13, lab: "Lab 4",
question: "In the code: pid_t pid = fork(); printf('%d', pid); what will the output be?",
options: ["0 only", "The child PID only", "Both 0 and the child PID", "Nothing"],
answer: "Both 0 and the child PID",
explanation: "The fork() call returns once in the parent (child's PID) and once in the child (0), so both are printed."
},
{
id: 14, lab: "Lab 4",
question: "Which of the following functions does NOT return to the calling function on successful execution?",
options: ["fork()", "wait()", "execv()", "chdir()"],
answer: "execv()",
explanation: "On success, exec() replaces the current process image; there is no 'return' because the old code is gone."
},
{
id: 15, lab: "Lab 4",
question: "What is wrong with: char *args[] = {'-l', NULL}; execv('/bin/ls', args);?",
options: ["Path is wrong", "Argument array must start with the program name", "NULL is not needed", "execv only takes one argument"],
answer: "Argument array must start with the program name",
explanation: "By convention, args[0] should be the name of the executable (e.g., 'ls')."
},
{
id: 16, lab: "Lab 4",
question: "If fork and execv execute successfully in a block where execv follows fork, how many times will a subsequent 'printf' in that block run?",
options: ["Once", "Twice", "Zero times (in the exec path)", "Infinite"],
answer: "Zero times (in the exec path)",
explanation: "The child process is replaced by execv and never reaches the printf; the parent skips the child's logic block."
},
{
id: 17, lab: "Lab 4",
question: "What can the access() call NOT do?",
options: ["Check if a file exists", "Check if a file is executable", "Open a file for reading", "Check for write permissions"],
answer: "Open a file for reading",
explanation: "access() only checks permissions and existence; it does not return a file descriptor like open()."
},
{
id: 18, lab: "Lab 4",
question: "What is the output of strsep() on 'apple,banana' using ',' as a delimiter on the first call?",
options: ["apple,banana", "apple", "banana", ","],
answer: "apple",
explanation: "strsep() returns the token before the delimiter and moves the pointer to the next token."
},
{
id: 19, lab: "Lab 6",
question: "Which file contains the implementation (actual code logic) of system calls in Xv6?",
options: ["kernel/syscall.h", "kernel/sysproc.c", "user/user.h", "kernel/main.c"],
answer: "kernel/sysproc.c",
explanation: "kernel/sysproc.c (along with sysfile.c) contains the actual kernel-side C functions for system calls."
},
{
id: 20, lab: "Lab 6",
question: "Which register of the RISC-V architecture is loaded with the system call number during a trap?",
options: ["a0", "a7", "sp", "ra"],
answer: "a7",
explanation: "In the RISC-V calling convention for Xv6/Linux, the system call number is placed in the a7 register."
}
];
