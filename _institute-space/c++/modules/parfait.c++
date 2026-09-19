#include <iostream>
using namespace std;

int main () {
    int x , y = 0;
    cout << "Enter a number: ";
    cin >> x;
    
    cout << "les diviseur de " << x << " sont: ";
    for (int i = 1; i <= x / 2 ; i++) {
        if (x % i == 0) {
            cout <<i  << " ";
            y = y + i;
        }
    }
    cout << endl;
    if (y == x) {
        cout << "le nombre " << x << " est parfait" << endl;
    } 
    else {
        cout << "le nombre " << x << " n'est pas parfait" << endl;
    }
}