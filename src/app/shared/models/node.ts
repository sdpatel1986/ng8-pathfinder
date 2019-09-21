export default class Node {
  public id: string;
  public status: any;
  public className: any;
  public previousNode: any;
  public path: any;
  public direction: any;
  public storedDirection: any;
  public distance: any;
  public totalDistance: any;
  public heuristicDistance: any;
  public weight: any;
  public relatesToObject: any;
  public overwriteObjectRelation: any;

  public otherid: any;
  public otherstatus: any;
  public otherpreviousNode: any;
  public otherpath: any;
  public otherdirection: any;
  public otherstoredDirection: any;
  public otherdistance: any;
  public otherweight: any;
  public otherrelatesToObject: any;
  public otheroverwriteObjectRelation: any;

  constructor(id: string, status: any) {
    this.id = id;
    this.status = status;
    this.className = status;
    this.previousNode = null;
    this.path = null;
    this.direction = null;
    this.storedDirection = null;
    this.distance = Infinity;
    this.totalDistance = Infinity;
    this.heuristicDistance = null;
    this.weight = 0;
    this.relatesToObject = false;
    this.overwriteObjectRelation = false;
    this.otherid = id;
    this.otherstatus = status;
    this.otherpreviousNode = null;
    this.otherpath = null;
    this.otherdirection = null;
    this.otherstoredDirection = null;
    this.otherdistance = Infinity;
    this.otherweight = 0;
    this.otherrelatesToObject = false;
    this.otheroverwriteObjectRelation = false;
  }
}
