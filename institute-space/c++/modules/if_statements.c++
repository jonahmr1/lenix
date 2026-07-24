# include <iostream>

using namespace std;

int main() {
    int num;
    string result;
    cout << "Please enter a random number: ";
     cin >> num;
/*    if (num > 0) {
        cout << "Le nombre '" << num << "' est un nombre Positive";
    } else if (num < 0) {
        cout << "Le nombre '" << num << "' est un nombre Negative";
    } else {
        cout << "Le nombre '" << num << "' est un nombre Null";
    } */

    if (num > 0) {
        cout << "Le nombre '" << num << "' est un nombre Positive";
    } else {
        if (num == 0) {
            cout << "Le nombre '" << num << "' est un nombre Null";
        } else {
            cout << "Le nombre '" << num << "' est un nombre Negative";
        }
    }

    return 0;
}

// why -1< ?0 <1 doesn't count as negative or a postive value ? ex: 0.123 || -0.123