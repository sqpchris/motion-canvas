import { ComputedContext } from '../signals';
export function createComputed(factory, owner) {
    return new ComputedContext(factory, owner).toSignal();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQ29tcHV0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2lnbmFscy9jcmVhdGVDb21wdXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQVcsZUFBZSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRXJELE1BQU0sVUFBVSxjQUFjLENBQzVCLE9BQW1DLEVBQ25DLEtBQVc7SUFFWCxPQUFPLElBQUksZUFBZSxDQUFTLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNoRSxDQUFDIn0=