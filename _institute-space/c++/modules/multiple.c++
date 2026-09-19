# include <iostream>
using namespace std;

int main () {
    int x;
    cout << "entre a aletoire nombre: ";
    cin >> x;
    if (x % 5 == 0) {
    cout << "Le nombre " << x << " est un nombre: 'multiple de nombre 5'" << endl;
    } else {
        cout << "Le nombre " << x <<" est pas un nombre: 'multiple de nombre 5'" << endl;
    }
}