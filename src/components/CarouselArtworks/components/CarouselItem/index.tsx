const CarouselItem = ({
  url,
  name,
  id,
  onClick,
}: {
  url: string
  name: string
  id: string
  onClick: (url: string, name: string, id: string) => void
}) => (
  <div
    onClick={() => onClick(url, name, id)}
    key={url}
    style={{ backgroundImage: `url(${url})` }}
    className="vertical-carousel-item absolute w-75 h-75 top-[-150px] left-[-150px] rounded-15 bg-no-repeat bg-cover bg-center"
  ></div>
)

export default CarouselItem
