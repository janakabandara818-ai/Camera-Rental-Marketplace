import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { getProducts } from '../../services/productService';

interface CategoryProduct {
  _id: string;
  category: string;
  image?: string;
}

const categories = [
  {
    value: 'camera',
    name: 'Cameras',
    description: 'Camera bodies for photography and video',
    image: '/products/sony-a7-iii.jpg',
  },
  {
    value: 'lens',
    name: 'Lenses',
    description: 'Prime and zoom lenses for your next shoot',
    image: '/products/sony-24-70-gm.jpg',
  },
  {
    value: 'lighting',
    name: 'Lighting',
    description: 'Lighting equipment for studio and location',
    image: '/products/godox-sl60w.jpg',
  },
  {
    value: 'accessory',
    name: 'Accessories',
    description: 'Audio, stabilizers, tripods and other gear',
    image: '/products/dji-rs3-pro.jpg',
  },
];

function CategoryImage({
  src,
  name,
}: {
  src: string;
  name: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div className="relative aspect-[4/3] w-full bg-white overflow-hidden">
      {failed ? (
        <div className="h-full flex items-center justify-center text-gray-500 text-sm">
          {name}
        </div>
      ) : (
        <img
          src={src}
          alt={`${name} equipment`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
      )}
    </div>
  );
}

export const CategoryGrid: React.FC = () => {
  const [products, setProducts] = useState<CategoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const requestNumber = useRef(0);

  const fetchCategories = useCallback(async () => {
    const currentRequest = ++requestNumber.current;

    setLoading(true);
    setError(false);

    try {
      const data = await getProducts();

      if (!Array.isArray(data)) {
        throw new Error('Invalid products response');
      }

      if (currentRequest === requestNumber.current) {
        setProducts(
          data.filter(
            (item) =>
              item &&
              typeof item.category === 'string'
          )
        );
      }
    } catch {
      if (currentRequest === requestNumber.current) {
        setError(true);
      }
    } finally {
      if (currentRequest === requestNumber.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void fetchCategories();

    return () => {
      requestNumber.current += 1;
    };
  }, [fetchCategories]);

  return (
    <section
      aria-labelledby="equipment-categories-title"
      className="py-16 bg-[#111827]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs text-amber-500 font-semibold uppercase tracking-wider mb-2">
              Browse by Category
            </p>

            <h2
              id="equipment-categories-title"
              className="text-2xl sm:text-3xl font-bold text-white font-display"
            >
              Explore Equipment Categories
            </h2>

            <p className="text-sm text-gray-400 mt-2">
              Find the equipment you need for your next project.
            </p>
          </div>

          <Link
            to="/products"
            className="text-sm text-gray-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1 font-medium"
          >
            <span>View All Equipment</span>
            <ArrowUpRight
              aria-hidden="true"
              className="w-4 h-4"
            />
          </Link>
        </div>

        {error && (
          <div
            role="status"
            className="flex flex-wrap items-center justify-between gap-3 mb-5 rounded-lg border border-gray-700 bg-[#161f30] p-4"
          >
            <p className="text-sm text-gray-400">
              Category totals are temporarily unavailable. You can
              still browse the equipment.
            </p>

            <button
              type="button"
              onClick={() => void fetchCategories()}
              className="text-sm text-amber-400 hover:text-amber-300"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((category) => {
            const categoryProducts = products.filter(
              (product) => product.category === category.value
            );

            const image =
              categoryProducts.find((product) => product.image)
                ?.image || category.image;

            const count = categoryProducts.length;

            return (
              <Link
                key={category.value}
                to={`/products?category=${category.value}`}
                className="group flex flex-col bg-[#161f30] rounded-xl overflow-hidden border border-gray-800 hover:border-amber-500/50 hover:shadow-lg transition-all duration-200"
              >
                <CategoryImage
                  src={image}
                  name={category.name}
                />

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-semibold text-white group-hover:text-amber-400 transition-colors">
                    {category.name}
                  </h3>

                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="mt-auto pt-5 flex items-center justify-between text-xs text-gray-400">
                    <span>
                      {loading
                        ? 'Loading listings...'
                        : error
                          ? 'Browse Equipment'
                          : `${count} listing${count === 1 ? '' : 's'}`}
                    </span>

                    <ArrowUpRight
                      aria-hidden="true"
                      className="w-4 h-4 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};