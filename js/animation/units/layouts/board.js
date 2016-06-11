define(function()
{
return function( size, side )
  {
    this.Board = [];
    this.Size = size;
    this.Side = side;

    for (var i = 0; i < size * size; i++)
      this.Board[i] = null;

    this.Get = function( x, y )
    {
      //console.log('REQ :' + (y * this.Size + x));
      //console.log('RES :' + this.Board[y * this.Size + x]);
      return this.Board[y * this.Size + x];
    };

    this.Set = function( x, y, Figure )
    {
      this.Board[y * this.Size + x] = Figure;
      //console.log(this.Board[y * this.Size + x]);
    };

    this.Refresh = function()
    {
      for (var i = 0; i < this.Size; i++)
        for (var j = 0; j < this.Size; j++)
          if (this.Get(j, i) != null)
            this.Get(j, i).Stamina = this.Get(j, i).Speed;
    };

    /**
     * @returns {string}
     */
    this.Attack = function( x1, y1, x2, y2 )
    {
      var a = this.Get(x1, y1);
      var d = this.Get(x2, y2);

      if (a.Stamina <= 0)
        return 'fail';
      var dist = Math.abs(x1 - x2) + Math.abs(y1 - y2);
      if (a.Side == d.Side)
        return 'select';
      if (dist <= a.Radius)
      {
        this.Get(x2, y2).Health -= a.Attack;
        this.Get(x1, y1).Stamina = 0;
        console.log(this.Get(x1, y1));
        if (d.Health <= 0)
        {
          d.Prim.Mesh.visible = false;
          this.Board[y2 * this.Size + x2] = null;
          if (d.Type == "king")
            return 'win';
          return 'kill';
        }
        return 'attack';
      }
      return 'fail';
    };

    /**
     * @returns {string}
     */
    this.Move = function( x1, y1, x2, y2 )
    {
      if ((x1 == x2) && (y1 == y2))
        return 'stop';
      if (this.Get(x1, y1) == null)
        if (this.Get(x2, y2) != null && this.Get(x2, y2).Side == this.Side)
          return 'select';
        else
          return 'fail';
      else
        if (this.Get(x1, y1).Side != this.Side)
          return 'fail';
      if (this.Get(x2, y2) != null)
        return this.Attack(x1, y1, x2, y2);
      var dist = Math.abs(x1 - x2) + Math.abs(y1 - y2);
      if (dist > this.Get(x1, y1).Stamina)
        return 'fail';
      this.Board[y2 * this.Size + x2] = this.Board[y1 * this.Size + x1];
      this.Set(x1, y1, null);
      this.Board[y2 * this.Size + x2].Prim.Mesh.position.add(new THREE.Vector3(y2 - y1, 0, x2 - x1));
      this.Board[y2 * this.Size + x2].Stamina -= dist;
      return 'move';
    };

    this.MoveEnemy = function( x1, y1, x2, y2 )
    {
      if ((x1 == x2) && (y1 == y2))
        return;
      if (this.Get(x1, y1) == null)
        return;
      if (this.Get(x2, y2) != null)
      {
        this.Attack(x1, y1, x2, y2);
        return;
      }
      this.Board[y2 * this.Size + x2] = this.Board[y1 * this.Size + x1];
      this.Set(x1, y1, null);
      this.Board[y2 * this.Size + x2].Prim.Mesh.position.add(new THREE.Vector3(y2 - y1, 0, x2 - x1));
    };
  }
});
