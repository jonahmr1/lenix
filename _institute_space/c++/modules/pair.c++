# include <iostream>
using namespace std;

int main () {
    int x;
    cout << "entre a aletoire nombre :";
    cin >> x;
    if (x % 2 == 0) {
    cout << "Le nombre " << x << " est un nombre: 'Pair'" << endl;
    } else {
        cout << "Le nombre " << x <<" est un nombre: 'Impair'" << endl;
    }
}