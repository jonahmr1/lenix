List<int> notes = [12, 15, 8, 17, 10];
List<String> fruits = ['Apple', 'Banana', 'Orange'];

void A() {
  print(notes);
  print('Length = ${notes.length}');
  print('First = ${notes.first}');
  print('Last = ${notes.last}');
}

void B() {
  int value = 0;
  for (int note in notes) {
    print('Note = ${note}');
    value = value + note;
  }
  print('Value = ${value}');

  double average = value / notes.length;
  print('Average = ${average}');
}

void C() {
  print('Contains Banana: ${fruits.contains('Banana')}');
  print('Orange index: ${fruits.indexOf('Orange')}');
  print('List: ${fruits.join(', ')}');
  print('Contains Kiwi: ${fruits.contains('Kiwi')}');
}

void main() {
  B();
}