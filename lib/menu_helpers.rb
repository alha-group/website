module MenuHelpers
  CustomMenu = Struct.new(:menu_label, :slug, :children) do
    def to_ary
      [menu_label, slug, children]
    end
  end
end
