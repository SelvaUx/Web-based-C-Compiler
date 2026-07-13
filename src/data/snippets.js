export const snippets = [
  {
    id: 'hello_world',
    title: 'Hello World',
    description: 'The standard entry point program in C.',
    category: 'Basic',
    code: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`
  },
  {
    id: 'calculator',
    title: 'Basic Calculator',
    description: 'Simple arithmetic calculator utilizing switch case statement.',
    category: 'Basic',
    code: `#include <stdio.h>

int main() {
    char operator;
    double num1, num2;

    printf("Enter an operator (+, -, *, /): ");
    scanf(" %c", &operator);
    printf("Enter two operands: ");
    scanf("%lf %lf", &num1, &num2);

    switch(operator) {
        case '+':
            printf("%.2lf + %.2lf = %.2lf\\n", num1, num2, num1 + num2);
            break;
        case '-':
            printf("%.2lf - %.2lf = %.2lf\\n", num1, num2, num1 - num2);
            break;
        case '*':
            printf("%.2lf * %.2lf = %.2lf\\n", num1, num2, num1 * num2);
            break;
        case '/':
            if(num2 != 0.0)
                printf("%.2lf / %.2lf = %.2lf\\n", num1, num2, num1 / num2);
            else
                printf("Error! Division by zero.\\n");
            break;
        default:
            printf("Error! Operator is not correct.\\n");
    }

    return 0;
}`
  },
  {
    id: 'arrays',
    title: 'Array Operations',
    description: 'Demonstrates scanning, calculating average, and finding max value in an array.',
    category: 'Data Structures',
    code: `#include <stdio.h>

int main() {
    int arr[5] = {12, 45, 8, 33, 90};
    int size = 5;
    int sum = 0;
    int max = arr[0];

    printf("Array elements: ");
    for(int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
        sum += arr[i];
        if(arr[i] > max) {
            max = arr[i];
        }
    }

    double average = (double)sum / size;
    printf("\\nSum: %d\\n", sum);
    printf("Average: %.2f\\n", average);
    printf("Maximum Value: %d\\n", max);

    return 0;
}`
  },
  {
    id: 'strings',
    title: 'String Manipulation',
    description: 'Uses string standard library functions for copying, comparing, and concatenating.',
    category: 'Basic',
    code: `#include <stdio.h>
#include <string.h>

int main() {
    char str1[20] = "Hello";
    char str2[20] = "World";
    char str3[40];

    // String copy
    strcpy(str3, str1);
    printf("strcpy(str3, str1): %s\\n", str3);

    // String concatenation
    strcat(str1, " ");
    strcat(str1, str2);
    printf("After concatenation (str1): %s\\n", str1);

    // String length
    printf("Length of str1: %lu\\n", strlen(str1));

    // String compare
    int cmp = strcmp(str2, "World");
    if(cmp == 0) {
        printf("str2 is equal to \\"World\\"\\n");
    } else {
        printf("str2 is not equal\\n");
    }

    return 0;
}`
  },
  {
    id: 'structures',
    title: 'Structures (struct)',
    description: 'Creating structs, instantiating, and passing them to functions.',
    category: 'Data Structures',
    code: `#include <stdio.h>
#include <string.h>

struct Student {
    char name[50];
    int rollNo;
    float marks;
};

void printStudentInfo(struct Student s) {
    printf("--- Student Details ---\\n");
    printf("Name: %s\\n", s.name);
    printf("Roll Number: %d\\n", s.rollNo);
    printf("Marks: %.2f\\n", s.marks);
}

int main() {
    struct Student s1;
    
    strcpy(s1.name, "Alice Johnson");
    s1.rollNo = 101;
    s1.marks = 92.5;

    printStudentInfo(s1);

    return 0;
}`
  },
  {
    id: 'pointers',
    title: 'Pointers Basics',
    description: 'Shows pointers reference, dereference, pointer arithmetic, and swapping values.',
    category: 'Intermediate',
    code: `#include <stdio.h>

void swap(int *x, int *y) {
    int temp = *x;
    *x = *y;
    *y = temp;
}

int main() {
    int num = 10;
    int *ptr = &num;

    printf("Value of num: %d\\n", num);
    printf("Address of num: %p\\n", (void*)&num);
    printf("Value stored in pointer ptr: %p\\n", (void*)ptr);
    printf("Value dereferenced from ptr: %d\\n", *ptr);

    int a = 5, b = 20;
    printf("\\nBefore swap: a = %d, b = %d\\n", a, b);
    swap(&a, &b);
    printf("After swap: a = %d, b = %d\\n", a, b);

    return 0;
}`
  },
  {
    id: 'linked_list',
    title: 'Linked List Implementation',
    description: 'Dynamic memory allocation, insertion at head/tail, and printing a linked list.',
    category: 'Data Structures',
    code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

void printList(struct Node* n) {
    printf("Linked List: ");
    while (n != NULL) {
        printf("%d -> ", n->data);
        n = n->next;
    }
    printf("NULL\\n");
}

void insertAtHead(struct Node** head_ref, int new_data) {
    struct Node* new_node = (struct Node*)malloc(sizeof(struct Node));
    new_node->data = new_data;
    new_node->next = (*head_ref);
    (*head_ref) = new_node;
}

int main() {
    struct Node* head = NULL;

    insertAtHead(&head, 30);
    insertAtHead(&head, 20);
    insertAtHead(&head, 10);
    
    printList(head);

    // Cleanup memory
    struct Node* current = head;
    struct Node* next;
    while (current != NULL) {
        next = current->next;
        free(current);
        current = next;
    }

    return 0;
}`
  },
  {
    id: 'queue',
    title: 'Queue (FIFO)',
    description: 'Simple array-based implementation of a queue (Enqueue and Dequeue).',
    category: 'Data Structures',
    code: `#include <stdio.h>
#define SIZE 5

int items[SIZE], front = -1, rear = -1;

void enQueue(int value) {
    if (rear == SIZE - 1)
        printf("Queue is Full!\\n");
    else {
        if (front == -1) front = 0;
        rear++;
        items[rear] = value;
        printf("Inserted: %d\\n", value);
    }
}

void deQueue() {
    if (front == -1)
        printf("Queue is Empty!\\n");
    else {
        printf("Deleted: %d\\n", items[front]);
        front++;
        if (front > rear) front = rear = -1;
    }
}

void display() {
    if (rear == -1)
        printf("Queue is Empty!\\n");
    else {
        printf("Queue elements: ");
        for (int i = front; i <= rear; i++)
            printf("%d ", items[i]);
        printf("\\n");
    }
}

int main() {
    enQueue(10);
    enQueue(20);
    enQueue(30);
    display();
    deQueue();
    display();
    return 0;
}`
  },
  {
    id: 'stack',
    title: 'Stack (LIFO)',
    description: 'Array-based Stack implementation (Push, Pop, Peek).',
    category: 'Data Structures',
    code: `#include <stdio.h>
#define MAX 5

int stack[MAX];
int top = -1;

void push(int val) {
    if (top == MAX - 1) {
        printf("Stack Overflow!\\n");
    } else {
        top++;
        stack[top] = val;
        printf("Pushed: %d\\n", val);
    }
}

int pop() {
    if (top == -1) {
        printf("Stack Underflow!\\n");
        return -1;
    } else {
        int val = stack[top];
        top--;
        printf("Popped: %d\\n", val);
        return val;
    }
}

void display() {
    if (top == -1) {
        printf("Stack is Empty!\\n");
    } else {
        printf("Stack elements: ");
        for(int i = top; i >= 0; i--) {
            printf("%d ", stack[i]);
        }
        printf("\\n");
    }
}

int main() {
    push(5);
    push(10);
    push(15);
    display();
    pop();
    display();
    return 0;
}`
  },
  {
    id: 'binary_tree',
    title: 'Binary Search Tree (BST)',
    description: 'BST node creation, insertion, and inorder traversal.',
    category: 'Data Structures',
    code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int key;
    struct Node *left, *right;
};

struct Node* newNode(int item) {
    struct Node* temp = (struct Node*)malloc(sizeof(struct Node));
    temp->key = item;
    temp->left = temp->right = NULL;
    return temp;
}

void inorder(struct Node* root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d -> ", root->key);
        inorder(root->right);
    }
}

struct Node* insert(struct Node* node, int key) {
    if (node == NULL) return newNode(key);
    
    if (key < node->key)
        node->left = insert(node->left, key);
    else if (key > node->key)
        node->right = insert(node->right, key);

    return node;
}

int main() {
    struct Node* root = NULL;
    root = insert(root, 50);
    insert(root, 30);
    insert(root, 20);
    insert(root, 40);
    insert(root, 70);
    insert(root, 60);
    insert(root, 80);

    printf("Inorder Traversal: ");
    inorder(root);
    printf("NULL\\n");

    return 0;
}`
  },
  {
    id: 'sorting',
    title: 'Bubble & Quick Sort',
    description: 'Implementation and comparison of Bubble Sort and Quick Sort algorithms.',
    category: 'Algorithms',
    code: `#include <stdio.h>

void swap(int* a, int* b) {
    int t = *a;
    *a = *b;
    *b = t;
}

// Bubble Sort
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1])
                swap(&arr[j], &arr[j+1]);
        }
    }
}

// Quick Sort partition
int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++)
        printf("%d ", arr[i]);
    printf("\\n");
}

int main() {
    int arr1[6] = {64, 34, 25, 12, 22, 11};
    int arr2[6] = {64, 34, 25, 12, 22, 11};
    int n = 6;

    printf("Original array: ");
    printArray(arr1, n);

    bubbleSort(arr1, n);
    printf("Bubble Sorted:  ");
    printArray(arr1, n);

    quickSort(arr2, 0, n - 1);
    printf("Quick Sorted:   ");
    printArray(arr2, n);

    return 0;
}`
  },
  {
    id: 'searching',
    title: 'Binary Search',
    description: 'Performs a binary search on a sorted integer array.',
    category: 'Algorithms',
    code: `#include <stdio.h>

int binarySearch(int arr[], int l, int r, int x) {
    while (l <= r) {
        int m = l + (r - l) / 2;

        if (arr[m] == x)
            return m;

        if (arr[m] < x)
            l = m + 1;
        else
            r = m - 1;
    }
    return -1;
}

int main() {
    int arr[] = {2, 3, 4, 10, 40};
    int n = sizeof(arr) / sizeof(arr[0]);
    int x = 10;
    
    printf("Searching for element: %d in [2, 3, 4, 10, 40]\\n", x);
    int result = binarySearch(arr, 0, n - 1, x);
    if(result == -1)
        printf("Element is not present in array\\n");
    else
        printf("Element is present at index: %d\\n", result);

    return 0;
}`
  },
  {
    id: 'dynamic_memory',
    title: 'Dynamic Memory (malloc)',
    description: 'Dynamic memory allocation, re-allocation (realloc) and freeing of memory.',
    category: 'Intermediate',
    code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n = 5;
    int *arr = (int*)malloc(n * sizeof(int));

    if (arr == NULL) {
        printf("Memory allocation failed!\\n");
        return 1;
    }

    printf("Initial allocation of %d elements:\\n", n);
    for (int i = 0; i < n; i++) {
        arr[i] = i + 1;
        printf("%d ", arr[i]);
    }
    printf("\\n");

    // Reallocate memory
    n = 8;
    arr = (int*)realloc(arr, n * sizeof(int));
    
    if (arr == NULL) {
        printf("Memory reallocation failed!\\n");
        return 1;
    }

    printf("After reallocating to %d elements:\\n", n);
    arr[5] = 6; arr[6] = 7; arr[7] = 8;
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");

    free(arr);
    printf("Memory successfully freed.\\n");

    return 0;
}`
  },
  {
    id: 'recursion',
    title: 'Recursion (Fibonacci)',
    description: 'Calculates the Fibonacci sequence up to N elements recursively.',
    category: 'Algorithms',
    code: `#include <stdio.h>

int fibonacci(int n) {
    if (n <= 1)
        return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    int limit = 10;
    printf("Fibonacci sequence up to %d iterations:\\n", limit);
    for (int i = 0; i < limit; i++) {
        printf("%d ", fibonacci(i));
    }
    printf("\\n");
    return 0;
}`
  }
];
