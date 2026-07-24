# include <iostream>

using namespace std;

int main() {
    int x;
    cout << "Enter un nombre: ";
    cin >> x;
    int p = --x;
    int s = x + 2;
    cout << "Predecesseur: " << p << endl;
    cout << "Successeur: " << s << endl;
    return 0;
}