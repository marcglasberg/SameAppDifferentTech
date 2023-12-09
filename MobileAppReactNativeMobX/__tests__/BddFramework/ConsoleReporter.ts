import { Feature, BddReporter } from './Bdd';

export class ConsoleReporter extends BddReporter {
  public async report(): Promise<void> {
    let output: string = '';

    for (const feature of this.features as Set<Feature>) {
      if (feature.testResults.length > 0) {  // Assuming 'feature' has a 'testResults' property
        const featureStr = feature.toString();  // Assuming 'feature' has a 'toString' method
        output += featureStr + '\n';
      }

      for (const testResult of feature.testResults) {
        output += testResult.toString() + '\n';  // Assuming 'testResult' has a 'toString' method
      }
    }

    console.log(output);
  }
}
