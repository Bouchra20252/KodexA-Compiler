import java.util.*;

interface Calculable {
    double calculateSalary();
}

class Employee implements Calculable {
    protected String name;
    protected int age;
    protected double baseSalary;

    public Employee(String name, int age, double baseSalary) {
        this.name = name;
        this.age = age;
        this.baseSalary = baseSalary;
    }

    @Override
    public double calculateSalary() {
        return baseSalary;
    }

    public void displayInfo() {
        System.out.println("Employee: " + name + ", Age: " + age + ", Salary: " + calculateSalary());
    }
}

class Manager extends Employee {
    private double bonus;

    public Manager(String name, int age, double baseSalary, double bonus) {
        super(name, age, baseSalary);
        this.bonus = bonus;
    }

    @Override
    public double calculateSalary() {
        return baseSalary + bonus;
    }

    @Override
    public void displayInfo() {
        System.out.println("Manager: " + name + ", Age: " + age + ", Total Salary: " + calculateSalary());
    }
}

public class Company {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        Employee[] staff = new Employee[3];
        staff[0] = new Employee("Alice", 30, 3000);
        staff[1] = new Manager("Bob", 45, 4000, 1000);
        staff[2] = new Employee("Charlie", 25, 2800);

        for (Employee emp : staff) {
            emp.displayInfo();
        }

        try {
            System.out.print("Enter index to view employee (0-2): ");
            int index = scanner.nextInt();
            staff[index].displayInfo();
        } catch (InputMismatchException e) {
            System.out.println("Invalid input. Please enter a number.");
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Index out of bounds.");
        }

        scanner.close();
    }
}
