import java.util.*;

class Policy {
    int id;
    String name;
    String type;
    double premium;

    Policy(int id, String name, String type, double premium) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.premium = premium;
    }

    double calculateYearlyPremium() {
        return premium * 12; // Monthly to yearly
    }
}

public class InsuranceSystem {
    static ArrayList<Policy> policies = new ArrayList<>();
    static Scanner sc = new Scanner(System.in);

    public static void main(String[] args) {
        int choice;

        do {
            System.out.println("\n===== Insurance Policy Management =====");
            System.out.println("1. Add Policy");
            System.out.println("2. View Policies");
            System.out.println("3. Search Policy");
            System.out.println("4. Delete Policy");
            System.out.println("5. Calculate Premium (Billing)");
            System.out.println("6. Exit");
            System.out.print("Enter your choice: ");

            choice = sc.nextInt();

            switch (choice) {
                case 1:
                    addPolicy();
                    break;
                case 2:
                    viewPolicies();
                    break;
                case 3:
                    searchPolicy();
                    break;
                case 4:
                    deletePolicy();
                    break;
                case 5:
                    calculatePremium();
                    break;
                case 6:
                    System.out.println("Exiting...");
                    break;
                default:
                    System.out.println("Invalid choice!");
            }
        } while (choice != 6);

        sc.close();
    }

    static void addPolicy() {
        System.out.print("Enter Policy ID: ");
        int id = sc.nextInt();
        sc.nextLine();

        System.out.print("Enter Name: ");
        String name = sc.nextLine();

        System.out.print("Enter Policy Type: ");
        String type = sc.nextLine();

        System.out.print("Enter Monthly Premium: ");
        double premium = sc.nextDouble();

        policies.add(new Policy(id, name, type, premium));
        System.out.println("Policy Added Successfully!");
    }

    static void viewPolicies() {
        if (policies.isEmpty()) {
            System.out.println("No policies available.");
            return;
        }

        for (Policy p : policies) {
            System.out.println(
                p.id + " | " + p.name + " | " + p.type
                + " | Monthly Premium: " + p.premium
            );
        }
    }

    static void searchPolicy() {
        System.out.print("Enter Policy ID to search: ");
        int id = sc.nextInt();

        for (Policy p : policies) {
            if (p.id == id) {
                System.out.println(
                    "Found: " + p.name + " | " + p.type
                    + " | Monthly Premium: " + p.premium
                );
                return;
            }
        }

        System.out.println("Policy Not Found!");
    }

    static void deletePolicy() {
        System.out.print("Enter Policy ID to delete: ");
        int id = sc.nextInt();

        boolean removed = policies.removeIf(p -> p.id == id);

        if (removed) {
            System.out.println("Policy Deleted Successfully!");
        } else {
            System.out.println("Policy Not Found!");
        }
    }

    static void calculatePremium() {
        System.out.print("Enter Policy ID: ");
        int id = sc.nextInt();

        for (Policy p : policies) {
            if (p.id == id) {
                double yearly = p.calculateYearlyPremium();

                System.out.printf(
                    "Yearly Premium for %s = %.2f%n",
                    p.name, yearly
                );
                return;
            }
        }

        System.out.println("Policy Not Found!");
    }
}