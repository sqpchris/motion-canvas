import { setTaskName } from '../threading';
export function run(firstArg, runner) {
    let task;
    if (typeof firstArg === 'string') {
        task = runner();
        setTaskName(task, firstArg);
    }
    else {
        task = firstArg();
        setTaskName(task, task);
    }
    return task;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Zsb3cvcnVuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxXQUFXLEVBQWtCLE1BQU0sY0FBYyxDQUFDO0FBZ0MxRCxNQUFNLFVBQVUsR0FBRyxDQUNqQixRQUEwQyxFQUMxQyxNQUE4QjtJQUU5QixJQUFJLElBQUksQ0FBQztJQUNULElBQUksT0FBTyxRQUFRLEtBQUssUUFBUSxFQUFFO1FBQ2hDLElBQUksR0FBRyxNQUFPLEVBQUUsQ0FBQztRQUNqQixXQUFXLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQzdCO1NBQU07UUFDTCxJQUFJLEdBQUcsUUFBUSxFQUFFLENBQUM7UUFDbEIsV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztLQUN6QjtJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyJ9