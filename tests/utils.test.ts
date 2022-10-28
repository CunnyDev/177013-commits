import { describe, it, expect } from "vitest";

import { parseDescription } from "../src/utils";

describe("Utilities Function", () => {
  it("parseDescription Function", () => {
    const { body, coAuthors } = parseDescription(`
Co-authored-by: กรกฎ วิริยะ <2264492+goragodwiriya@users.noreply.github.com>

what
        
Co-authored-by: Nutthapat Pongtanyavichai <59821765+Leomotors@users.noreply.github.com>
Co-authored-by: Kitpipat Jaritwong <77166960+Gusb3ll@users.noreply.github.com>
`);

    expect(body.trim()).toBe("what");

    expect(coAuthors).toEqual([
      "กรกฎ วิริยะ <2264492+goragodwiriya@users.noreply.github.com>",
      "Nutthapat Pongtanyavichai <59821765+Leomotors@users.noreply.github.com>",
      "Kitpipat Jaritwong <77166960+Gusb3ll@users.noreply.github.com>",
    ]);
  });
});
