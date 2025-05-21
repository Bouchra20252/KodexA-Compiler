#include <iostream>
using namespace std;

int main() {
    // Repeating a line of code to make the file large
    string largeString = "int a = 1;\n"; // This line will be repeated multiple times
    
    for (int i = 0; i < 500000; i++) {  // This will make the file over 1MB
        cout << largeString;
    }

    return 0;
}
