export {};

console.log('=== Part 4: Autograd ===\n');

class Value {
  constructor(
    public data: number,
    public grad = 0,
    private _backward: () => void = () => {},
    private _prev: Value[] = [],
  ) {}

  add(other: Value): Value {
    const out = new Value(this.data + other.data, 0, () => {
      this.grad += out.grad;
      other.grad += out.grad;
    }, [this, other]);
    return out;
  }

  mul(other: Value): Value {
    const out = new Value(this.data * other.data, 0, () => {
      this.grad += other.data * out.grad;
      other.grad += this.data * out.grad;
    }, [this, other]);
    return out;
  }

  backward(): void {
    this.grad = 1;
    const topo: Value[] = [];
    const visited = new Set<Value>();
    const build = (v: Value) => {
      if (visited.has(v)) return;
      visited.add(v);
      for (const c of v._prev) build(c);
      topo.push(v);
    };
    build(this);
    for (let i = topo.length - 1; i >= 0; i--) topo[i]._backward();
  }
}

const x = new Value(2);
const y = new Value(3);
const z = x.mul(y).add(new Value(1));
z.backward();
console.log('z = x*y + 1 =', z.data);
console.log('dz/dx =', x.grad, 'dz/dy =', y.grad);
