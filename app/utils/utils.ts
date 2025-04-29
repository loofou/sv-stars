import { Color, Vector3 } from 'three';
import YAML from 'yaml';

export abstract class StarUtils {
  public static getColor(temperature: number): Color {
    if (temperature > 50000) {
      return new Color('#9bb2ff');
    } else if (temperature > 40000) {
      return new Color('#9eb5ff');
    } else if (temperature > 30000) {
      return new Color('#a3b9ff');
    } else if (temperature > 20000) {
      return new Color('#aabfff');
    } else if (temperature > 10000) {
      return new Color('#ccd8ff');
    } else if (temperature > 9000) {
      return new Color('#d3ddff');
    } else if (temperature > 8000) {
      return new Color('#e4e9ff');
    } else if (temperature > 7000) {
      return new Color('#f3f2ff	');
    } else if (temperature > 6500) {
      return new Color('#fff9fb');
    } else if (temperature > 6000) {
      return new Color('#fff5ef');
    } else if (temperature > 5000) {
      return new Color('#ffe8ce');
    } else if (temperature > 4000) {
      return new Color('#ffd6a5');
    } else if (temperature > 3500) {
      return new Color('#ffcc8f');
    } else if (temperature > 3000) {
      return new Color('#ffc178');
    } else if (temperature > 2500) {
      return new Color('#ffa94b');
    } else if (temperature > 2000) {
      return new Color('#ff9523');
    } else if (temperature > 1500) {
      return new Color('#ff7b00');
    } else if (temperature > 1000) {
      return new Color('#ff5200');
    } else if (temperature < 1000) {
      return new Color('#800080');
    }

    return new Color();
  }

  public static convertToYaml(systems: System[]): string {
    return YAML.stringify(systems, {
      sortMapEntries: (a, b) => {
        if (a.key == 'name' || b.key == 'name') {
          return a.key == 'name' ? -1 : 1;
        }
        return a < b ? -1 : 1;
      },
    });
  }

  public static saveToFile(json: string, fileName: string) {
    const element = document.createElement('a');
    const file = new Blob([json], {
      type: 'text/plain;charset=utf-8',
    });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
  }

  public static convertToVec3(position: [number, number, number]): Vector3 {
    const [x, y, z] = position;
    return new Vector3(x, y, z);
  }
}
