import { BddReporter, TestResult } from './Bdd';
import { promises as fsPromises } from 'fs';
import { join } from 'path';

export class FeatureFileReporter extends BddReporter {
  // Change this to output the results to another dir.
  static dir = './gen_features/';

  constructor() {
    super();
  }

  async report(): Promise<void> {
    let featureArray = Array.from(this.features);
    for (let i = 0; i < featureArray.length; i++) {
      const feature = featureArray[i];
      let sink: fsPromises.FileHandle | null = null;

      try {
        const fileName = this.normalizeFileName(feature.title);
        const filePath = join(this.directory, `${fileName}.feature`);
        await fsPromises.mkdir(this.directory, { recursive: true });

        console.log(`Generating ${filePath}`);

        sink = await fsPromises.open(filePath, 'w');
        await sink.writeFile(feature.toString());

        for (let j = 0; j < feature.testResults.length; j++) {
          await this.writeScenario(sink, feature.testResults[j]);
        }
      } catch (e) {
        console.log('Failed generating feature files!');
      } finally {
        if (sink) {
          await sink.close();
        }
      }
    }
  }

  // Add a bar to the end of dir, only if necessary.
  private get directory(): string {
    return (FeatureFileReporter.dir.endsWith('/') || FeatureFileReporter.dir.endsWith('\\'))
      ? FeatureFileReporter.dir : FeatureFileReporter.dir + '/';
  }

  private async writeScenario(sink: fsPromises.FileHandle, test: TestResult): Promise<void> {
    await sink.writeFile('\n');
    for (const term of test.terms) {
      await sink.writeFile(`${term.toString()}\n`);
    }
  }

  // TODO: Move this to a Jest Custom Reporter?
  // private async _init(): Promise<void> {
  //   if (this.clearAllOutputBeforeRun) {
  //     console.log(`Deleting all generated feature files from ${this.directory}`);
  //     try {
  //       await fsPromises.rm(this.directory, { recursive: true, force: true });
  //     } catch (e) {
  //       console.log('Could not delete previously generated feature files.');
  //     }}
  //   console.log(`Feature files will be saved in ${this.directory}`);
  // }
  // private async _finish(): Promise<void> {
  //   console.log('Finished.'); }
}
