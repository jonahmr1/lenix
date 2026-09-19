#include <iostream>
using namespace std;

int main () {
    int i, n;
    cout << "Entre un nombre de debut: ";
    cin >> i;
    cout << "Entre un autre nombre de repetition: ";
    cin >> n;
    n--;
    n += i;
    for (i; i <= n; i++) {
        cout << i << " ";
    }
    return 0;
}